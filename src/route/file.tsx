import { awsS3GetObject } from "../aws";
import { registerRoute } from "./factory/registerRoute";

registerRoute({
  id: "file",
  alias: [],
  args: (a: { bucket: string; key: string }) => ({
    bucket: a.bucket,
    key: a.key,
  }),
  aws: async ({ bucket, key }) => {
    const content = await awsS3GetObject(bucket, key);
    return content.split("\n").map((line, idx) => ({ line }));
  },
  title: (args) => args.key,
  columns: [{ title: "", render: "line" }],
  keymaps: [],
});
