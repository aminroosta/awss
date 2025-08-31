import { awsListStacks } from "../aws";
import { createResource, createSignal, For } from "solid-js";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { pushRoute, revision, routes } from "../store";

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

  const onEnter = (stack: { StackId: string; StackName: string }) => {
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
