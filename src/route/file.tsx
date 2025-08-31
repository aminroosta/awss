import { createResource } from "solid-js";
import { awsS3GetObject } from "../aws";
import { List } from "../ui/list";

export const File = (p: { args: { bucket: string, key: string } }) => {
  const [file] = createResource(
    () => ({ bucket: p.args.bucket, key: p.args.key }),
    ({ bucket, key }) => awsS3GetObject(bucket, key),
    { initialValue: '⏳' }
  );

  const lines = () => file().split('\n').map((line, index) => ({ line, index }));
  return (
    <box flexGrow={1} paddingLeft={1} paddingRight={1}>
      <List
        items={lines()}
        onEnter={() => { }}
        columns={[
          { title: p.args.key, render: 'line' }
        ]}
      />
    </box>
  );
}
