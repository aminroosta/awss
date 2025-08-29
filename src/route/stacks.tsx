import { awsListBuckets, awsListStacks as awsStacksList } from "../aws";
import { createResource, For } from "solid-js";

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
    <box>

      <For each={stacks().StackSummaries}>
        {(stack) => (
          <box flexDirection="row" justifyContent="space-between">
            <text>{stack.StackName}</text>
            <text flexGrow={0.5}>{stack.CreationTime}</text>
            <text flexGrow={0.5}>{stack.StackStatus}</text>
          </box>
        )}
      </For>
    </box>

  );
};
