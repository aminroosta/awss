import { awsEc2DescribeSubnets, awsRegion, awsUrls } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: 'subnets',
  alias: ['subnets'],
  args: () => ({}),
  aws: async () => {
    const data = await awsEc2DescribeSubnets();
    return data.map(s => ({
      ...s,
      Name: s.Tags?.find(t => t.Key === 'Name')?.Value ?? '',
      DefaultForAz: s.DefaultForAz ? 'Yes' : 'No',
      MapPublicIpOnLaunch: s.MapPublicIpOnLaunch ? 'Yes' : 'No',
    }));
  },
  title: () => 'subnets',
  filter: () => 'all',
  columns: [
    { title: 'Name', render: 'Name' },
    { title: 'ID', render: 'SubnetId' },
    { title: 'CIDR', render: 'CidrBlock' },
    { title: 'AZ', render: 'AvailabilityZone' },
    { title: 'VPC', render: 'VpcId' },
    { title: 'STATE', render: 'State' },
  ],
  keymaps: [
     {
       key: 'a',
       name: 'AWS Website',
       fn: async (item, _args) => {
         const url = await awsUrls.subnets(item.SubnetId);
         openInBrowser(url);
       }
     },
  ],
});
