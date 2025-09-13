import { awsEc2DescribeSecurityGroups, awsRegion, awsEc2DescribeSecurityGroup, awsUrls } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import type { ParsedKey } from "@opentui/core";
import { registerYamlRoute } from "./yaml";

registerRoute({
  id: "securitygroups",
  alias: ["sgs", "securitygroups"],
  args: () => ({}),
  aws: async () => {
    const data = await awsEc2DescribeSecurityGroups();
    return data;
  },
  title: () => "security groups",
  filter: () => "all",
  columns: [
    { title: "GROUP ID", render: "GroupId" },
    { title: "NAME", render: "GroupName" },
    { title: "DESCRIPTION", render: "Description" },
    { title: "VPC ID", render: "VpcId" },
  ],
  onEnter: () => { },
  keymaps: [
    {
      key: "return",
      name: "View Details",
      fn: (item) => {
        pushRoute({
          id: "securitygroup",
          args: { ...item },
        });
      },
    },
    {
      key: "a",
      name: "AWS Website",
      fn: async (item) => {
        const url = await awsUrls.securitygroup(item.GroupId);
        openInBrowser(url);
      },
    },
  ],
});


registerYamlRoute({
  id: "securitygroup",
  args: (a: { GroupId: string }) => a,
  aws: (args) =>
    awsEc2DescribeSecurityGroup(args.GroupId, "yaml") as Promise<string>,
  title: (args) => `Security Group: ${args.GroupId}`,
  url: (args) => awsUrls.securitygroup!(args.GroupId),
});
