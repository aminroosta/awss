import { awsListBuckets, awsListStacks as awsStacksList } from "../aws";
import { createResource, For } from "solid-js";
import { List } from "../ui/list";
import { dim } from "@opentui/core";

export const Stacks = () => {
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
    <List
      items={stacks().StackSummaries}
      columns={[
        { title: 'STACK', render: 'StackName' },
        { title: 'CREATED', render: (item: any) => item.CreationTime.split('T')[0] },
        { title: 'STATUS', render: 'StackStatus' },
      ]}
    />
  );
};
