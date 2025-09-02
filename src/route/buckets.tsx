import { createResource, createSignal, For } from "solid-js";
import { useKeyHandler } from "@opentui/solid";
import { awsListBuckets } from "../aws";
import { List } from "../ui/list";
import { Title } from "../ui/title";
import { pushRoute, revision, routes } from "../store";
import { log } from "../util/log";

export const Buckets = () => {
  const [buckets] = createResource(
    () => ({ revision: revision() }),
    () => awsListBuckets(),
    { initialValue: { Buckets: [{ Name: '⏳', CreationDate: '' }], Owner: { DisplayName: '', ID: '' } } }
  );

  const onEnter = (bucket: { Name: string }) => {
    pushRoute({
      ...routes.Objects,
      args: { bucket: bucket.Name.trim(), prefix: '' }
    });
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
