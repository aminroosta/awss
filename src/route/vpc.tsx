import { awsEc2DescribeVpc } from "../aws";
import { createYamlRoute } from "./yaml";

createYamlRoute({
  id: 'vpc',
  args: (a: { VpcId: string }) => a,
  aws: (args) => awsEc2DescribeVpc(args.VpcId, 'yaml') as Promise<string>,
  title: (args) => `VPC: ${args.VpcId}`,
  url: (region, args) => `https://console.aws.amazon.com/vpcconsole/home?region=${region}#VpcDetails:VpcId=${args.VpcId}`,
});
