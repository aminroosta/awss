import { createResource, For } from "solid-js";
import { awsListBuckets } from "../aws";
import { List } from "../ui/list";

export const Buckets = () => {
  const [buckets] = createResource(awsListBuckets, { initialValue: { Buckets: [{ Name: '...', CreationDate: '' }], Owner: { DisplayName: '..', ID: '...' } } });

  return (
    <box>
      <List items={buckets().Buckets} columns={[
        { title: 'BUCKET', render: 'Name' },
        { title: 'CREATED', render: 'CreationDate' },
      ]} />
    </box>
  );
};
