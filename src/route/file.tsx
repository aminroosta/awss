import { createResource } from "solid-js";
import { awsS3GetObject } from "../aws";
import { revision } from "../store";
import { List } from "../ui/list";
import { Title } from "../ui/title";

export const File = (p: { args: { bucket: string, key: string } }) => {
  const [file] = createResource(
    () => ({ bucket: p.args.bucket, key: p.args.key, revision: revision() }),
    ({ bucket, key }) => awsS3GetObject(bucket, key),
    { initialValue: '⏳' }
  );

  const lines = () => file().split('\n').map((line, idx) => ({ line }));
  return (
    <box flexGrow={1}>
      <Title
        title={p.args.key}
        count={file.loading ? '⏳' : lines().length + ' lines'}
      />
      <List
        items={lines()}
        columns={[
          { title: '', render: 'line' },
        ]}
        onEnter={() => { }}
      />
    </box>
  );
}
