import { awsListStacks } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { pushRoute, setNotification } from "../store";
import { TextAttributes, type ParsedKey } from "@opentui/core";

const resourceCapableStatuses = new Set<string>([
  'CREATE_IN_PROGRESS',
  'CREATE_COMPLETE',
  'UPDATE_IN_PROGRESS',
  'UPDATE_COMPLETE',
  'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
  'UPDATE_ROLLBACK_IN_PROGRESS',
  'UPDATE_ROLLBACK_COMPLETE',
  'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
  'ROLLBACK_IN_PROGRESS',
  'ROLLBACK_COMPLETE',
  'ROLLBACK_FAILED',
  'IMPORT_IN_PROGRESS',
  'IMPORT_COMPLETE',
  'IMPORT_ROLLBACK_IN_PROGRESS',
  'IMPORT_ROLLBACK_COMPLETE',
  'REVIEW_IN_PROGRESS',
]);

const valiateStackStatus = (stack: { StackName: string; StackStatus?: string }) => {
  const status = (stack.StackStatus || '').trim();
  if (resourceCapableStatuses.has(status)) {
    return true;
  }
  setNotification({
    message: `Stack ${stack.StackName} is ${status || 'unknown'}`,
    level: 'error',
    timeout: 2500,
  });
  return false;
}

registerRoute({
  id: 'stacks',
  alias: ['stacks'],
  actions: [
    { key: 'r', name: 'Refresh' },
    { key: 'e', name: 'Events' },
    { key: 'p', name: 'Parameters' },
    { key: 'enter', name: 'Open' },
  ],
  args: () => ({}),
  aws: async () => awsListStacks(),
  title: () => 'stacks',
  filter: () => 'all',
  columns: [
    { title: 'STACK', render: 'StackName', attrs: (s) => s.StackStatus === "DELETE_COMPLETE" ? TextAttributes.STRIKETHROUGH | TextAttributes.DIM : 0 },
    { title: 'CREATED', render: 'CreationTime', attrs: (s) => s.StackStatus === "DELETE_COMPLETE" ? TextAttributes.STRIKETHROUGH | TextAttributes.DIM : 0 },
    { title: 'STATUS', render: 'StackStatus', attrs: (s) => s.StackStatus === "DELETE_COMPLETE" ? TextAttributes.STRIKETHROUGH | TextAttributes.DIM : 0 },
  ],
  onEnter: (stack) => {
    const status = (stack.StackStatus || '').trim();
    if (resourceCapableStatuses.has(status)) {
      pushRoute({
        id: 'resources',
        args: { stackName: stack.StackName.trim() }
      });
    } else {
      setNotification({
        message: `Stack ${stack.StackName} is ${status || 'unknown'}`,
        level: 'error',
        timeout: 2500,
      });
    }
  },
  onKey: (key, stack) => {
    if (key.name === 'e' && valiateStackStatus(stack)) {
      pushRoute({
        id: 'stackevents',
        args: { stackName: stack.StackName },
      });
    } else if (key.name === 'p' && !key.ctrl && valiateStackStatus(stack)) {
      pushRoute({
        id: 'stackparameters',
        args: { stackName: stack.StackName },
      });
    }
  },
});
