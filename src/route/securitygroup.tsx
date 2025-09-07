import { awsEc2DescribeSecurityGroup, awsUrls } from "../aws";
import { createYamlRoute } from "./yaml";

createYamlRoute({
  id: 'securitygroup',
  args: (a: { GroupId: string }) => a,
  aws: (args) => awsEc2DescribeSecurityGroup(args.GroupId, 'yaml') as Promise<string>,
  title: (args) => `Security Group: ${args.GroupId}`,
  url: (args) => awsUrls.securitygroup!(args.GroupId),
});
