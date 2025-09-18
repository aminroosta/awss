import { awsEc2DescribeSubnets, awsRegion, awsUrls } from "../api";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import type { ParsedKey } from "@opentui/core";

registerRoute({
  id: "subnets",
  alias: ["subnets"],
  args: (a: { VpcId?: string }) => a,
  aws: async (args) => {
    const data = await awsEc2DescribeSubnets();
    const filtered = args.VpcId
      ? data.filter((s) => s.VpcId === args.VpcId)
      : data;
    return filtered.map((s) => ({
      ...s,
      Name: s.Tags?.find((t) => t.Key === "Name")?.Value ?? "",
      DefaultForAz: s.DefaultForAz ? "Yes" : "No",
      MapPublicIpOnLaunch: s.MapPublicIpOnLaunch ? "Yes" : "No",
    }));
  },
  title: () => "subnets",
  filter: (args) => args.VpcId || "all",
  columns: [
    { title: "Name", render: "Name" },
    { title: "ID", render: "SubnetId" },
    { title: "CIDR", render: "CidrBlock" },
    { title: "AZ", render: "AvailabilityZone" },
    { title: "VPC", render: "VpcId" },
    { title: "STATE", render: "State" },
  ],
  keymaps: [
    {
      key: "return",
      name: "Open",
      fn: (item) => {
        pushRoute({
          id: "subnet",
          args: { SubnetId: item.SubnetId },
        });
      },
    },
    {
      key: "y",
      name: "YAML",
      fn: (item) => {
        pushRoute({
          id: "subnet_yaml",
          args: { SubnetId: item.SubnetId },
        });
      },
    },
    {
      key: "a",
      name: "AWS Website",
      fn: async (item, _args) => {
        const url = await awsUrls.subnets!(item.SubnetId);
        openInBrowser(url);
      },
    },
  ],
});
