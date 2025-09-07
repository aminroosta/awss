import { awsEc2DescribeInstances, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

const getTag = (item: any, key: string) => item?.Tags?.find((t: any) => t.Key === key)?.Value || '';

registerRoute({
  id: 'instances',
  alias: ['ec2', 'instances'],
  args: () => ({}),
  aws: async () => {
    const data = await awsEc2DescribeInstances();
    return data.map(i => ({
      Name: getTag(i, 'Name') as string,
      InstanceId: i.InstanceId,
      State: i.State?.Name || '',
      PublicIpAddress: i.PublicIpAddress || i.NetworkInterfaces?.[0]?.Association?.PublicIp || '',
      Age: (() => {
        if (!i.LaunchTime) return '';
        const diffMs = Date.now() - new Date(i.LaunchTime).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return diffDays > 99 ? `${diffDays}d` : `${diffDays}d ${diffHours}h`;
      })(),
      InstanceType: i.InstanceType,
      Zone: i.Placement?.AvailabilityZone || '',
    }));
  },
  title: () => 'instances',
  filter: () => 'all',
  columns: [
    { title: 'NAME', render: 'Name' },
    { title: 'INSTANCE ID', render: 'InstanceId' },
    { title: 'STATE', render: 'State' },
    { title: 'IPV4', render: 'PublicIpAddress' },
    { title: 'AGE', render: 'Age' },
    { title: 'TYPE', render: 'InstanceType' },
    { title: 'A. ZONE', render: 'Zone' },
  ],
  keymaps: [
    { key: 'r', name: 'Refresh', fn: () => { } },
    {
      key: 'a', name: 'Aws Website', fn: async (item) => {
        const region = await awsRegion();
        const url = `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#InstanceDetails:instanceId=${item.InstanceId}`;
        openInBrowser(url);
      }
    },
  ],
});
