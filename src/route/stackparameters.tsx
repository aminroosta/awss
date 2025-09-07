import { awsCfDescribeStack, awsRegion, awsUrls } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { log } from "../util/log";

registerRoute({
  id: "stackparameters",
  alias: [],
  args: (a: { StackName: string; StackId: string }) => ({
    StackName: a.StackName,
    StackId: a.StackId,
  }),
  aws: ({ StackName }) =>
    awsCfDescribeStack(StackName).then((s) => s.Parameters || []),
  title: (args) => `${args.StackName} parameters`,
  columns: [
    { title: "PARAMETER", render: "ParameterKey" },
    { title: "VALUE", render: "ParameterValue" },
  ],
  keymaps: [
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      fn: async (item, args) => {
        const url = await awsUrls.stackparameters(args.StackId);
        openInBrowser(url);
      },
    },
  ],
});
