import { awsEc2DescribeSecurityGroups, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: 'securitygroups',
  alias: ['sgs', 'securitygroups'],
  args: () => ({}),
  aws: async () => {
    const data = await awsEc2DescribeSecurityGroups();
    return data;
  },
  title: () => 'security groups',
  filter: () => 'all',
  columns: [
    { title: 'GROUP ID', render: 'GroupId' },
    { title: 'NAME', render: 'GroupName' },
    { title: 'DESCRIPTION', render: 'Description' },
    { title: 'VPC ID', render: 'VpcId' },
  ],
  onEnter: () => { },
  keymaps: [
    {
      key: 'a',
      name: 'AWS Website',
      fn: async (item) => {
        const region = await awsRegion();
        openInBrowser(`https://console.aws.amazon.com/ec2/v2/home?region=${region}#SecurityGroups:groupId=${item.GroupId}`);
      }
    },
  ],
});
