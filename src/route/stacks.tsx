import { awsListStacks } from "../aws";
import { createResource, createSignal } from "solid-js";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { pushRoute, revision, routes, setNotification } from "../store";
import { TextAttributes, type ParsedKey } from "@opentui/core";

export const Stacks = () => {
  const initialValue = [{ StackName: '⏳', StackId: '', CreationTime: '', StackStatus: '' }];
  const [filter, setFilter] = createSignal('all');
  const [stacks] = createResource(
    () => ({ revision: revision() }),
    () => awsListStacks(),
    { initialValue }
  );
  type Item = Awaited<ReturnType<typeof awsListStacks>>[number];

  const checkResourceCapable = (
    stack: { StackId: string; StackName: string; StackStatus?: string },
    callback: () => void
  ) => {
    const status = (stack.StackStatus || '').trim();
    if (resourceCapableStatuses.has(status)) {
      callback();
    } else {
      setNotification({
        message: `Stack ${stack.StackName} is ${status || 'unknown'}`,
        level: 'error',
        timeout: 2500,
      });
    }
  };

  const onEnter = (stack: { StackId: string; StackName: string; StackStatus?: string }) => {
    checkResourceCapable(stack, () => {
      pushRoute({
        ...routes.Resources,
        args: { stackName: stack.StackName.trim() }
      });
    });
  };
  const onKey = (key: ParsedKey, stack: Item) => {
    if (key.name === 'e') {
      checkResourceCapable(stack, () => {
        pushRoute({
          id: 'stackevents',
          args: { stackName: stack.StackName },
        });
      });
    } else if (key.name === 'p' && !key.ctrl) {
      checkResourceCapable(stack, () => {
        pushRoute({
          id: 'stackparameters',
          args: { stackName: stack.StackName },
        });
      });
    }
  }


  const attrs = (s: Item) => {
    return s.StackStatus === "DELETE_COMPLETE" ? TextAttributes.STRIKETHROUGH | TextAttributes.DIM : 0;
  }

  return (
    <box flexGrow={1}>
      <Title
        title="stacks"
        filter={filter()}
        count={stacks.loading ? '⏳' : stacks().length}
      />
      <List
        items={stacks.loading ? initialValue : stacks()}
        onEnter={onEnter}
        onKey={onKey}
        columns={[
          { title: 'STACK', render: 'StackName', attrs },
          { title: 'CREATED', render: 'CreationTime', attrs },
          { title: 'STATUS', render: 'StackStatus', attrs },
        ]}
      />
    </box>
  );
};

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
