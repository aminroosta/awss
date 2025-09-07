import { awsCfListStackResources, awsRegion } from "../aws";
import { registerRoute } from "./factory/registerRoute";
import { openInBrowser } from "../util/system";
import type { ParsedKey } from "@opentui/core";
import { log } from "../util/log";

registerRoute({
  id: 'resources',
  alias: [],
  args: (a: { StackName: string, StackId: string }) => ({ StackName: a.StackName, StackId: a.StackId }),
  aws: async ({ StackName }) => {
    const data = await awsCfListStackResources(StackName);
    return data.StackResourceSummaries.map(r => {
      r.LastUpdatedTimestamp = r.LastUpdatedTimestamp.split('T')[0]!;
      return r;
    });
  },
  title: (args) => args.StackName,
  filter: () => 'all',
  columns: [
    { title: 'Name', render: 'LogicalResourceId' },
    { title: 'TYPE', render: 'ResourceType' },
    { title: 'STATUS', render: 'ResourceStatus' },
    { title: 'UPDATED', render: 'LastUpdatedTimestamp' },
  ],
  keymaps: [
    {
      key: { name: 'a', ctrl: false },
      name: 'AWS Website',
      fn: async (item, args) => {
        log({ item, args });
        const region = await awsRegion();
        let url = '';

        switch (item.ResourceType) {
          case 'AWS::S3::Bucket':
            url = `https://console.aws.amazon.com/s3/buckets/${item.PhysicalResourceId}`;
            break;
          case 'AWS::EC2::Instance':
            url = `https://console.aws.amazon.com/ec2/home?region=${region}#InstanceDetails:instanceId=${item.PhysicalResourceId}`;
            break;
          case 'AWS::EC2::SecurityGroup':
            url = `https://console.aws.amazon.com/ec2/home?region=${region}#SecurityGroups:search=${item.PhysicalResourceId}`;
            break;
          case 'AWS::EC2::Subnet':
            url = `https://console.aws.amazon.com/vpcconsole/home?region=${region}#SubnetDetails:subnetId=${item.PhysicalResourceId}`;
            break;
          case 'AWS::EC2::VPC':
            url = `https://console.aws.amazon.com/vpcconsole/home?region=${region}#VpcDetails:VpcId=${item.PhysicalResourceId}`;
            break;
          case 'AWS::AutoScaling::AutoScalingGroup':
            url = `https://console.aws.amazon.com/ec2/home?region=${region}#AutoScalingGroupDetails:id=${item.PhysicalResourceId};view=details`;
            break;
          case 'AWS::EC2::LaunchTemplate':
            url = `https://console.aws.amazon.com/ec2/home?region=${region}#LaunchTemplateDetails:launchTemplateId=${item.PhysicalResourceId}`;
            break;
          default:
            // Fallback to CloudFormation resources tab
            url = `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/resources?stackId=${encodeURIComponent(args.StackId)}&tabId=resources`;
            break;
        }

        openInBrowser(url);
      }
    },
  ],
});
