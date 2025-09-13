import {
  awsCfListStackResources,
  awsEc2DescribeSecurityGroup,
  awsRegion,
  awsUrls,
} from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";
import { log } from "../util/log";
import { pushRoute, setNotification } from "../store";

registerRoute({
  id: "resources",
  alias: [],
  args: (a: { StackName: string; StackId: string }) => ({
    StackName: a.StackName,
    StackId: a.StackId,
  }),
  aws: async ({ StackName }) => {
    const data = await awsCfListStackResources(StackName);
    return data.StackResourceSummaries.map((r) => {
      r.LastUpdatedTimestamp = r.LastUpdatedTimestamp.split("T")[0]!;
      return r;
    });
  },
  title: (args) => args.StackName,
  filter: () => "all",
  columns: [
    { title: "Name", render: "LogicalResourceId" },
    { title: "TYPE", render: "ResourceType" },
    { title: "STATUS", render: "ResourceStatus" },
    { title: "UPDATED", render: "LastUpdatedTimestamp" },
  ],
  keymaps: [
    {
      key: "return",
      name: "Open",
      fn: async (item) => {
        if (item.ResourceType === "AWS::S3::Bucket") {
          pushRoute({
            id: "objects",
            args: { bucket: item.PhysicalResourceId, prefix: "" },
          });
        } else if (item.ResourceType === "AWS::EC2::Instance") {
          pushRoute({
            id: "instance_yaml",
            args: { InstanceId: item.PhysicalResourceId },
          });
        } else if (item.ResourceType === "AWS::EC2::SecurityGroup") {
          const group = await awsEc2DescribeSecurityGroup(
            item.PhysicalResourceId,
          );
          pushRoute({
            id: "securitygroup_yaml",
            args: { ...group },
          });
        } else if (item.ResourceType === "AWS::EC2::VPC") {
          pushRoute({
            id: "vpc_yaml",
            args: { VpcId: item.PhysicalResourceId },
          });
        } else {
          setNotification({
            message: "Not implemented",
            level: "warn",
            timeout: 3000,
          });
        }
      },
    },
    {
      key: { name: "a", ctrl: false },
      name: "AWS Website",
      fn: async (item, args) => {
        let url = "";

        switch (item.ResourceType) {
          case "AWS::S3::Bucket":
            url = await awsUrls.buckets(item.PhysicalResourceId);
            break;
          case "AWS::EC2::Instance":
            url = await awsUrls.instances(item.PhysicalResourceId);
            break;
          case "AWS::EC2::SecurityGroup":
            const group = await awsEc2DescribeSecurityGroup(
              item.PhysicalResourceId,
            );
            url = await awsUrls.securitygroup(group.GroupId);
            break;
          case "AWS::EC2::Subnet":
            url = await awsUrls.subnets(item.PhysicalResourceId);
            break;
          case "AWS::EC2::VPC":
            url = await awsUrls.vpc(item.PhysicalResourceId);
            break;
          case "AWS::AutoScaling::AutoScalingGroup":
            // Note: AutoScalingGroup URL not in awsUrls, keeping original
            const region = await awsRegion();
            url = `https://console.aws.amazon.com/ec2/home?region=${region}#AutoScalingGroupDetails:id=${item.PhysicalResourceId};view=details`;
            break;
          case "AWS::EC2::LaunchTemplate":
            // Note: LaunchTemplate URL not in awsUrls, keeping original
            const region2 = await awsRegion();
            url = `https://console.aws.amazon.com/ec2/home?region=${region2}#LaunchTemplateDetails:launchTemplateId=${item.PhysicalResourceId}`;
            break;
          default:
            // Fallback to CloudFormation resources tab
            url = await awsUrls.resources(args.StackId);
            break;
        }

        openInBrowser(url);
      },
    },
  ],
});
