import {
  awsEc2DescribeSecurityGroup,
  awsUrls,
} from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import { registerYamlRoute } from "./yaml";

registerRoute({
  id: "securitygroup",
  alias: [],
  args: (a: { GroupId: string }) => a,
  aws: async (args) => {
    const sg = await awsEc2DescribeSecurityGroup(args.GroupId);
    const rules = [
      ...(sg.IpPermissions || []).map((perm) => {
        const portRange = perm.FromPort === perm.ToPort
          ? perm.FromPort?.toString() || "All"
          : `${perm.FromPort}-${perm.ToPort}` || "All";

        const sources = perm.IpRanges?.map(r => r.CidrIp).join(", ") ||
          perm.UserIdGroupPairs?.map(g => g.GroupId).join(", ") ||
          perm.PrefixListIds?.map(p => p.PrefixListId).join(", ") ||
          "All";

        return {
          GroupId: sg.GroupId,
          Direction: "Inbound",
          Protocol: perm.IpProtocol?.toUpperCase() || "All",
          PortRange: portRange,
          Target: sources,
          Description: perm.IpRanges?.[0]?.Description || "",
        };
      }),
      ...(sg.IpPermissionsEgress || []).map((perm) => {
        const portRange = perm.FromPort === perm.ToPort
          ? perm.FromPort?.toString() || "All"
          : `${perm.FromPort}-${perm.ToPort}` || "All";

        const destinations = perm.IpRanges?.map(r => r.CidrIp).join(", ") ||
          perm.UserIdGroupPairs?.map(g => g.GroupId).join(", ") ||
          perm.PrefixListIds?.map(p => p.PrefixListId).join(", ") ||
          "All";

        return {
          GroupId: sg.GroupId,
          Direction: "Outbound",
          Protocol: perm.IpProtocol?.toUpperCase() || "All",
          PortRange: portRange,
          Target: destinations,
          Description: perm.IpRanges?.[0]?.Description || "",
        };
      })
    ];
    return rules;
  },
  title: (args) => `Security Group: ${args.GroupId}`,
  filter: () => "all",
  columns: [
    { title: "DIRECTION", render: "Direction" },
    { title: "PROTOCOL", render: "Protocol" },
    { title: "PORT RANGE", render: "PortRange" },
    { title: "SOURCE/DEST", render: "Target" },
    { title: "DESCRIPTION", render: "Description" },
  ],
  keymaps: [
    {
      key: "y",
      name: "YAML",
      when: () => true,
      fn: (_, args) => {
        pushRoute({
          id: "securitygroup_yaml",
          args: { GroupId: args.GroupId },
        });
      },
    },
    {
      key: "a",
      name: "AWS Website",
      when: () => true,
      fn: async (_, args) => {
        const url = await awsUrls.securitygroup!(args.GroupId);
        openInBrowser(url);
      },
    },
  ],
});

registerYamlRoute({
  id: "securitygroup_yaml",
  args: (a: { GroupId: string }) => a,
  aws: (args) =>
    awsEc2DescribeSecurityGroup(args.GroupId, "yaml") as Promise<string>,
  title: (args) => `Security Group: ${args.GroupId}`,
  url: (args) => awsUrls.securitygroup!(args.GroupId),
});
