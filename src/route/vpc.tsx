import { awsEc2DescribeVpc, awsUrls } from "../aws";
import { createYamlRoute } from "./yaml";

createYamlRoute({
  id: 'vpc',
  args: (a: { VpcId: string }) => a,
  aws: (args) => awsEc2DescribeVpc(args.VpcId, 'yaml') as Promise<string>,
  title: (args) => `VPC: ${args.VpcId}`,
  url: (args) => awsUrls.vpc!(args.VpcId),
});
