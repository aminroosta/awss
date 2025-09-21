import { awsRegion } from "./cli";

export const awsUrls: Record<string, (id: string, name?: string) => Promise<string>> = {
  vpc: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/vpcconsole/home?region=${region}#VpcDetails:VpcId=${id}`;
  },
  securitygroup: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/ec2/home?region=${region}#SecurityGroup:groupId=${id}`;
  },
  instances: async (id) => {
    const region = await awsRegion();
    return `https://${region}.console.aws.amazon.com/ec2/home?region=${region}#InstanceDetails:instanceId=${id}`;
  },
  users: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/iam/home?region=${region}#/users/${id}`;
  },
  stacks: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/stackinfo?stackId=${encodeURIComponent(id)}`;
  },
  subnets: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/vpcconsole/home?region=${region}#SubnetDetails:subnetId=${id}`;
  },
  buckets: async (id) => `https://console.aws.amazon.com/s3/buckets/${id}`,
  stackparameters: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/parameters?stackId=${encodeURIComponent(id)}&tabId=parameters`;
  },
  stackevents: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/events?stackId=${encodeURIComponent(id)}&tabId=events`;
  },
  resources: async (id) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/cloudformation/home?region=${region}#/stacks/resources?stackId=${encodeURIComponent(id)}&tabId=resources`;
  },
  repositories: async (id) =>
    `https://console.aws.amazon.com/ecr/repositories/${id}`,
  clusters: async (arn) => {
    const region = await awsRegion();
    return `https://console.aws.amazon.com/ecs/v2/clusters/${encodeURIComponent(
      arn.split("/").pop() || arn,
    )}/services?region=${region}`;
  },
  cluster_task: async (id, clusterName) => {
    const region = await awsRegion();
    return `https://${region}.console.aws.amazon.com/ecs/v2/clusters/${clusterName}/tasks/${id}/configuration`
  },
};
