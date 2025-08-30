import { awsListBuckets, awsListStacks as awsStacksList } from "../aws";
import { createResource, createSignal, For } from "solid-js";
import { List } from "../ui/list";
import { dim, bold } from "@opentui/core";
import { colors } from "../util/colors";
import { Title } from "../ui/title";

export const Stacks = () => {
  const [filter, setFilter] = createSignal('all');
  const [stacks] = createResource(awsStacksList, {
    initialValue: {
      StackSummaries: [{
        StackId: '...',
        StackName: '...',
        CreationTime: '...',
        StackStatus: '...',
      }]
    }
  });

  return (
    <box flexGrow={1}>
      <Title
        title="stacks"
        filter={filter()}
        count={stacks.loading ? '⏳' : stacks().StackSummaries.length}
      />
      <List
        items={stacks().StackSummaries}
        columns={[
          { title: 'STACK', render: 'StackName' },
          { title: 'CREATED', render: (item: any) => item.CreationTime.split('T')[0] },
          { title: 'STATUS', render: 'StackStatus' },
        ]}
      />
    </box>
  );
};
