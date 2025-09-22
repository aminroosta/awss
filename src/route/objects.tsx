import {
  awsListObjectsV2,
  awsListObjectsV2Search,
  awsRegion,
  awsS3GetObject,
} from "../api";
import { registerRoute } from "./factory/registerRoute";
import {
  popRoute,
  pushRoute,
  routes,
  setNotification,
  setSearchText,
} from "../store";
import { openInBrowser } from "../util/system";
import { openInVim } from "../util/tmux";

const PARENT_DIR_KEY = ".. (up a dir)";

registerRoute({
  id: "objects",
  alias: [],
  searchPlaceholder: "Press <Enter> to include objects in all subdirectories",
  args: (a: { bucket: string; prefix: string }) => a,
  aws: async ({ bucket, prefix, search }) => {
    const data = search
      ? await awsListObjectsV2Search(bucket, search, prefix)
      : await awsListObjectsV2(bucket, prefix);
    const contents = (Array.isArray(data) ? data : data.Contents || []).map(
      (c) => ({
        Key: c.Key.replace(prefix, ""),
        LastModified: c.LastModified.split("+")[0]!,
        Size:
          c.Size < 1024
            ? c.Size + " B"
            : c.Size < 1024 * 1024
              ? (c.Size / 1024).toFixed(1) + " KB"
              : c.Size < 1024 * 1024 * 1024
                ? (c.Size / (1024 * 1024)).toFixed(1) + " MB"
                : (c.Size / (1024 * 1024 * 1024)).toFixed(1) + " GB",
      }),
    );
    const prefixes = ((data as any).CommonPrefixes || []).map(
      (cp: { Prefix: string }) => ({
        Key: cp.Prefix.replace(prefix, ""),
        LastModified: "",
        Size: "<DIR>",
      }),
    );
    const parentDir = { Key: PARENT_DIR_KEY, LastModified: "", Size: "" };
    return [parentDir, ...prefixes, ...contents];
  },
  title: (args) => args.bucket,
  filter: (args) => (args.prefix ? "/" + args.prefix : undefined),
  columns: [
    { title: "KEY", render: "Key" },
    { title: "SIZE", render: "Size" },
    { title: "LAST MODIFIED", render: "LastModified" },
  ],
  keymaps: [
    {
      key: "return",
      name: "View file",
      fn: async (item, args) => {
        if (item.Key === PARENT_DIR_KEY) {
          popRoute();
        } else if (item.Size === "<DIR>") {
          pushRoute({
            id: "objects",
            args: { bucket: args.bucket, prefix: args.prefix + item.Key },
          });
        } else {
          setSearchText("");
          const fullKey = args.prefix + item.Key;
          pushRoute({
            id: "file",
            args: { bucket: args.bucket, key: fullKey },
          });
        }
      },
    },
    {
      key: "a",
      name: "AWS Website",
      when: (item) => item && item.Key !== PARENT_DIR_KEY,
      fn: async (item, args) => {
        const region = await awsRegion();
        if (item.Size !== "<DIR>") {
          openInBrowser(
            `https://${region}.console.aws.amazon.com/s3/object/${args.bucket}?region=us-east-2&prefix=${encodeURIComponent(args.prefix + item.Key)}`,
          );
        } else {
          openInBrowser(
            `https://${region}.console.aws.amazon.com/s3/buckets/${args.bucket}?region=us-east-2&prefix=${encodeURIComponent(args.prefix + item.Key)}&showversions=false`,
          );
        }
      },
    },
    {
      key: "n",
      name: "Open in nvim",
      when: (item) =>
        item && item.Key !== PARENT_DIR_KEY && item.Size !== "<DIR>",
      fn: async (item, args) => {
        setNotification({
          level: "info",
          message: "Openning in novim …",
          timeout: 1500,
        });
        const fullKey = args.prefix + item.Key;
        const content = await awsS3GetObject(args.bucket, fullKey);
        setNotification(null as any);
        await openInVim(content, item.Key);
      },
    },
  ],
});
