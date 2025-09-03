import { createResource } from "solid-js";
import { awsS3GetObject } from "../aws";
import { revision } from "../store";
import { ListV2 } from "../ui/listv2";

export const File = (p: { args: { bucket: string, key: string } }) => {
  const [file] = createResource(
    () => ({ bucket: p.args.bucket, key: p.args.key, revision: revision() }),
    ({ bucket, key }) => awsS3GetObject(bucket, key),
    { initialValue: '⏳' }
  );

  const lines = () => file().split('\n');
  return (
    <box flexGrow={1} paddingLeft={1} paddingRight={1}>
      <ListV2
        items={lines()}
        onEnter={() => { }}
        isModal
      />
    </box>
  );
}
