import { awsEc2DescribeVpcs, awsRegion, awsUrls } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: "vpcs",
  alias: ["vpcs"],
  args: () => ({}),
  aws: async () => {
    const data = await awsEc2DescribeVpcs();
    return data.map((v) => ({
      ...v,
      Default: v.IsDefault ? "Yes" : "No",
    }));
  },
  title: () => "vpcs",
  filter: () => "all",
  columns: [
    { title: "VPC ID", render: "VpcId" },
    { title: "STATE", render: "State" },
    { title: "CIDR BLOCK", render: "CidrBlock" },
    { title: "DEFAULT", render: "Default" },
  ],
  keymaps: [
    {
      key: "return",
      name: "Open",
      fn: async (item) => {
        pushRoute({
          id: "vpc",
          args: { VpcId: item.VpcId },
        });
      },
    },
    {
      key: "a",
      name: "AWS Website",
      fn: async (item, _args) => {
        const url = await awsUrls.vpc(item.VpcId);
        openInBrowser(url);
      },
    },
  ],
});
