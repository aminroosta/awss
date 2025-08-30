import { createResource, For } from "solid-js";
import { awsListBuckets } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";

export const Buckets = () => {
  const [buckets] = createResource(awsListBuckets, { initialValue: { Buckets: [{ Name: '...', CreationDate: '' }], Owner: { DisplayName: '..', ID: '...' } } });

  const onEnter = (bucket: { Name: string }) => {
  };
  return (
    <box flexGrow={1}>
      <Title
        title="buckets"
        filter='all'
        count={buckets.loading ? '⏳' : buckets().Buckets.length}
      />
      <List items={buckets().Buckets}
        onEnter={onEnter}
        columns={[
          { title: 'BUCKET', render: 'Name' },
          { title: 'CREATED', render: 'CreationDate' },
        ]} />
    </box>
  );
};
