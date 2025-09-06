import { awsListStacks } from "../aws";
import { batch, createResource, createSignal, For } from "solid-js";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { pushRoute, revision, routes, setNotification } from "../store";
import { colors } from "../util/colors";
import { bold, dim, strikethrough, TextAttributes } from "@opentui/core";

export const Stacks = () => {
  const [filter, setFilter] = createSignal('all');
  const [stacks] = createResource(
    () => ({ revision: revision() }),
    () => awsListStacks(),
    {
      initialValue: [{
        StackId: '',
        StackName: '⏳',
        CreationTime: '',
        StackStatus: '',
      }]
    });
  type Item = Awaited<ReturnType<typeof awsListStacks>>[number];

  const onEnter = (stack: { StackId: string; StackName: string; StackStatus?: string }) => {
    const status = (stack.StackStatus || '').trim();
    if (!resourceCapableStatuses.has(status)) {
      setNotification({
        message: `Stack ${stack.StackName} has no resources.\nStatus: ${status || 'unknown'}`,
        level: 'error',
        timeout: 2500,
      });
      return;
    }
    pushRoute({
      ...routes.Resources,
      args: { stackName: stack.StackName.trim() }
    });
  };

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
        items={stacks()}
        onEnter={onEnter}
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
