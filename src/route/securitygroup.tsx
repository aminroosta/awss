import { awsEc2DescribeSecurityGroup } from "../aws";
import { createYamlRoute } from "./yaml";

createYamlRoute({
  id: 'securitygroup',
  args: (a: { GroupId: string }) => a,
  aws: (args) => awsEc2DescribeSecurityGroup(args.GroupId, 'yaml') as Promise<string>,
  title: (args) => `Security Group: ${args.GroupId}`,
  url: (region, args) => `https://console.aws.amazon.com/ec2/home?region=${region}#SecurityGroup:groupId=${args.GroupId}`,
});
