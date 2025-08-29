import { createResource, For } from "solid-js";
import { awsListBuckets } from "../aws";

export const Buckets = () => {
  const [buckets] = createResource(awsListBuckets, { initialValue: { Buckets: [{ Name: '...', CreationDate: '' }], Owner: { DisplayName: '..', ID: '...' } } });

  return (
    <box>
      <For each={buckets().Buckets}>
        {(bucket) => (
          <box flexDirection="row" justifyContent="space-between">
            <text>{bucket.Name}</text>
            <text flexGrow={0.5}>{bucket.CreationDate}</text>
          </box>
        )}
      </For>
    </box>
  );
};
