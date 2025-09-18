import {
  awsEc2DescribeSubnet,
  awsEc2DescribeSubnetYaml,
  awsUrls,
} from "../api";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import { registerYamlRoute } from "./yaml";

registerRoute({
  id: "subnet",
  alias: [],
  args: (a: { SubnetId: string }) => a,
  aws: async (args) => {
    const subnet = await awsEc2DescribeSubnet(args.SubnetId);
    return [
      {
        ...subnet,
        Name: subnet.Tags?.find((t) => t.Key === "Name")?.Value ?? "",
        DefaultForAz: subnet.DefaultForAz ? "Yes" : "No",
        MapPublicIpOnLaunch: subnet.MapPublicIpOnLaunch ? "Yes" : "No",
      },
    ];
  },
  title: (args) => `Subnet: ${args.SubnetId}`,
  filter: () => "all",
  columns: [
    { title: "Name", render: "Name" },
    { title: "ID", render: "SubnetId" },
    { title: "CIDR", render: "CidrBlock" },
    { title: "AZ", render: "AvailabilityZone" },
    { title: "VPC", render: "VpcId" },
    { title: "STATE", render: "State" },
    { title: "DEFAULT FOR AZ", render: "DefaultForAz" },
    { title: "MAP PUBLIC IP", render: "MapPublicIpOnLaunch" },
  ],
  keymaps: [
    {
      key: "y",
      name: "YAML",
      when: () => true,
      fn: (_, args) => {
        pushRoute({
          id: "subnet_yaml",
          args: { SubnetId: args.SubnetId },
        });
      },
    },
    {
      key: "a",
      name: "AWS Website",
      when: () => true,
      fn: async (_, args) => {
        const url = await awsUrls.subnets!(args.SubnetId);
        openInBrowser(url);
      },
    },
  ],
});

registerYamlRoute({
  id: "subnet_yaml",
  args: (a: { SubnetId: string }) => a,
  aws: (args) => awsEc2DescribeSubnetYaml(args.SubnetId),
  title: (args) => `Subnet: ${args.SubnetId}`,
  url: (args) => awsUrls.subnets!(args.SubnetId),
});
