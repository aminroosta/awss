import {
  awsEc2DescribeInstances,
  awsEc2DescribeInstance,
  awsRegion,
  awsUrls,
} from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import { pushRoute } from "../store";
import { registerYamlRoute } from "./yaml";
import { TextAttributes, type ParsedKey } from "@opentui/core";

const getTag = (item: any, key: string) =>
  item?.Tags?.find((t: any) => t.Key === key)?.Value || "";
const attrs = (i: any) =>
  i.State === "stopped" ? TextAttributes.STRIKETHROUGH | TextAttributes.DIM : 0;

registerRoute({
  id: "instances",
  alias: ["ec2", "instances"],
  args: () => ({}),
  aws: async () => {
    const data = await awsEc2DescribeInstances();
    return data
      .map((i) => ({
        Name: getTag(i, "Name") as string,
        InstanceId: i.InstanceId,
        State: i.State?.Name || "",
        PublicIpAddress:
          i.PublicIpAddress ||
          i.NetworkInterfaces?.[0]?.Association?.PublicIp ||
          "",
        Age: (() => {
          if (!i.LaunchTime) return "";
          const diffMs = Date.now() - new Date(i.LaunchTime).getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const diffHours = Math.floor(
            (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          );
          return diffDays > 99 ? `${diffDays}d` : `${diffDays}d ${diffHours}h`;
        })(),
        InstanceType: i.InstanceType,
        Zone: i.Placement?.AvailabilityZone || "",
      }))
      .sort((a, b) => a.State.localeCompare(b.State));
  },
  title: () => "instances",
  filter: () => "all",
  columns: [
    { title: "NAME", render: "Name", attrs },
    { title: "INSTANCE ID", render: "InstanceId", attrs },
    { title: "STATE", render: "State", attrs },
    { title: "IPV4", render: "PublicIpAddress", attrs },
    { title: "AGE", render: "Age", attrs },
    { title: "TYPE", render: "InstanceType", attrs },
    { title: "A. ZONE", render: "Zone", attrs },
  ],
  keymaps: [
    {
      key: "y",
      name: "YAML",
      fn: async (item) => {
        pushRoute({
          id: "instance_yaml",
          args: { InstanceId: item.InstanceId },
        });
      },
    },
    {
      key: "l",
      name: "Console Log",
      fn: async (item) => {
        pushRoute({
          id: "instance_log",
          args: { InstanceId: item.InstanceId },
        });
      },
    },
    {
      key: "a",
      name: "AWS Website",
      fn: async (item) => {
        const url = await awsUrls.instances(item.InstanceId);
        openInBrowser(url);
      },
    },
  ],
});

registerYamlRoute({
  id: "instance_yaml",
  args: (a: { InstanceId: string }) => a,
  aws: (args) =>
    awsEc2DescribeInstance(args.InstanceId, "yaml") as Promise<string>,
  title: (args) => `Instance: ${args.InstanceId}`,
  url: (args) => awsUrls.instances!(args.InstanceId),
});
