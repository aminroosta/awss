import {
  awsCfDescribeStackEvents,
  awsCfDescribeStack,
  awsRegion,
  awsUrls,
} from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";

registerRoute({
  id: "stackevents",
  alias: [],
  args: (a: { StackName: string; StackId: string }) => ({
    StackName: a.StackName,
    StackId: a.StackId,
  }),
  aws: ({ StackName }) =>
    awsCfDescribeStackEvents(StackName).then((events) =>
      events.map((e) => ({
        ...e,
        ResourceStatusReason: e.ResourceStatusReason || "",
        Timestamp:
          (e.Timestamp || "").split("T")[0] +
          " " +
          (e.Timestamp || "").split("T")[1]?.split(".")[0],
      })),
    ),
  title: (args) => `${args.StackName} events`,
  columns: [
    { title: "RESOURCE", render: "LogicalResourceId" },
    { title: "TYPE", render: "ResourceType" },
    { title: "STATUS", render: "ResourceStatus" },
    { title: "REASON", render: "ResourceStatusReason" },
    { title: "TIMESTAMP", render: "Timestamp" },
  ],
  keymaps: [
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      fn: async (item, args) => {
        const url = await awsUrls.stackevents(args.StackId);
        openInBrowser(url);
      },
    },
  ],
});
