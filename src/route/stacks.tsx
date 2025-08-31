import { awsListStacks } from "../aws";
import { createResource, createSignal, For } from "solid-js";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { pushRoute, revision, routes, setNotification } from "../store";

export const Stacks = () => {
  const [filter, setFilter] = createSignal('all');
  const [stacks] = createResource(() => revision(), () => awsListStacks(), {
    initialValue: {
      StackSummaries: [{
        StackId: '',
        StackName: '⏳',
        CreationTime: '',
        StackStatus: '',
      }]
    }
  });

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

  return (
    <box flexGrow={1}>
      <Title
        title="stacks"
        filter={filter()}
        count={stacks.loading ? '⏳' : stacks().StackSummaries.length}
      />
      <List
        items={stacks().StackSummaries}
        onEnter={onEnter}
        columns={[
          { title: 'STACK', render: 'StackName' },
          { title: 'CREATED', render: (item: any) => item.CreationTime.split('T')[0] },
          { title: 'STATUS', render: 'StackStatus' },
        ]}
      />
    </box>
  );
};
