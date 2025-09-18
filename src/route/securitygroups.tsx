import {
  awsEc2DescribeSecurityGroups,
  awsRegion,
  awsEc2DescribeSecurityGroup,
  awsUrls,
} from "../api";
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
  onEnter: (item) => {
    pushRoute({
      id: "securitygroup",
      args: { GroupId: item.GroupId },
    });
  },
  keymaps: [
    {
      key: "return",
      name: "Open",
      fn: (item) => {
        pushRoute({
          id: "securitygroup",
          args: { GroupId: item.GroupId },
        });
      },
    },
    {
      key: "y",
      name: "YAML",
      fn: (item) => {
        pushRoute({
          id: "securitygroup_yaml",
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
