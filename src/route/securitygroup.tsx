import { awsEc2DescribeSecurityGroup, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";

const getTag = (item: any, key: string) => item?.Tags?.find((t: any) => t.Key === key)?.Value || '';

registerRoute({
  id: 'securitygroup',
  alias: [],
  args: (a: { GroupId: string }) => a,
  aws: async ({ GroupId }) => {
    const sg = await awsEc2DescribeSecurityGroup(GroupId);
    const inbound = (sg.IpPermissions || []).map((perm, index) => ({
      Type: 'Inbound',
      Protocol: perm.IpProtocol === '-1' ? 'All' : perm.IpProtocol.toUpperCase(),
      Port: perm.FromPort !== undefined ? (perm.FromPort === perm.ToPort ? perm.FromPort.toString() : `${perm.FromPort}-${perm.ToPort}`) : 'All',
      Source: [
        ...perm.IpRanges.map(r => r.CidrIp),
        ...perm.Ipv6Ranges.map(r => r.CidrIpv6),
        ...perm.UserIdGroupPairs.map(g => g.GroupId || g.GroupName || ''),
        ...perm.PrefixListIds.map(p => p.PrefixListId),
      ].join(', ') || 'N/A',
      Description: perm.IpRanges.find(r => r.Description)?.Description ||
        perm.Ipv6Ranges.find(r => r.Description)?.Description ||
        perm.UserIdGroupPairs.find(g => g.GroupName)?.GroupName || '',
    }));
    const outbound = (sg.IpPermissionsEgress || []).map((perm, index) => ({
      Type: 'Outbound',
      Protocol: perm.IpProtocol === '-1' ? 'All' : perm.IpProtocol.toUpperCase(),
      Port: perm.FromPort !== undefined ? (perm.FromPort === perm.ToPort ? perm.FromPort.toString() : `${perm.FromPort}-${perm.ToPort}`) : 'All',
      Source: [
        ...perm.IpRanges.map(r => r.CidrIp),
        ...perm.Ipv6Ranges.map(r => r.CidrIpv6),
        ...perm.UserIdGroupPairs.map(g => g.GroupId || g.GroupName || ''),
        ...perm.PrefixListIds.map(p => p.PrefixListId),
      ].join(', ') || 'N/A',
      Description: perm.IpRanges.find(r => r.Description)?.Description ||
        perm.Ipv6Ranges.find(r => r.Description)?.Description ||
        perm.UserIdGroupPairs.find(g => g.GroupName)?.GroupName || '',
    }));
    return [...inbound, ...outbound];
  },
  title: (args) => `Security Group: ${args.GroupId}`,
  filter: () => 'all',
  columns: [
    { title: 'TYPE', render: 'Type' },
    { title: 'PROTOCOL', render: 'Protocol' },
    { title: 'PORT', render: 'Port' },
    { title: 'SOURCE/DEST', render: 'Source' },
    { title: 'DESCRIPTION', render: 'Description' },
  ],
  keymaps: [
    {
      key: 'a',
      name: 'AWS Website',
      fn: async (item, args) => {
        const region = await awsRegion();
        openInBrowser(`https://console.aws.amazon.com/ec2/v2/home?region=${region}#SecurityGroups:groupId=${args.GroupId}`);
      }
    },
  ],
});
