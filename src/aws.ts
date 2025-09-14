import { $ } from "bun";
import { log } from "./util/log";
import { memo } from "./util/memo";
// ------------
export * from "./api/api";
import { awsRegion } from "./api/cli";




export const awsEcrDescribeRepositories = memo(async () => {
  try {
    const result =
      (await $`aws ecr describe-repositories --output json`.json()) as {
        repositories: {
          repositoryArn: string;
          registryId: string;
          repositoryName: string;
          repositoryUri: string;
          createdAt: string;
          imageTagMutability: string;
          imageScanningConfiguration?: {
            scanOnPush: boolean;
          };
          encryptionConfiguration?: {
            encryptionType: string;
          };
        }[];
      };
    return result.repositories;
  } catch (e: any) {
    e.command = "aws ecr describe-repositories --output json";
    throw e;
  }
}, 30_000);

export const awsEcrListImages = memo(async (repositoryName: string) => {
  try {
    const result =
      (await $`aws ecr list-images --repository-name='${repositoryName}' --output json`.json()) as {
        imageIds: {
          imageDigest?: string;
          imageTag?: string;
        }[];
      };
    return result.imageIds;
  } catch (e: any) {
    e.command = `aws ecr list-images --repository-name='${repositoryName}' --output json`;
    throw e;
  }
}, 30_000);

export const awsEc2DescribeInstances = memo(async () => {
  try {
    const result =
      (await $`aws ec2 describe-instances --output json`.json()) as {
        Reservations: {
          ReservationId: string;
          OwnerId: string;
          RequesterId: string;
          Groups: { GroupName: string; GroupId: string }[];
          Instances: {
            InstanceId: string;
            ImageId: string;
            State: { Code: number; Name: string };
            PrivateDnsName?: string;
            PublicDnsName?: string;
            InstanceType: string;
            LaunchTime: string;
            Placement: {
              AvailabilityZone: string;
              GroupName: string;
              Tenancy: string;
            };
            Monitoring: { State: string };
            SubnetId?: string;
            VpcId?: string;
            PrivateIpAddress?: string;
            PublicIpAddress?: string;
            Architecture: string;
            RootDeviceType: string;
            RootDeviceName: string;
            Hypervisor: string;
            EnaSupport: boolean;
            EbsOptimized: boolean;
            ClientToken?: string;
            BlockDeviceMappings?: {
              DeviceName: string;
              Ebs: {
                VolumeId: string;
                Status: string;
                AttachTime: string;
                DeleteOnTermination: boolean;
              };
            }[];
            NetworkInterfaces?: {
              Association?: {
                IpOwnerId?: string;
                PublicDnsName?: string;
                PublicIp?: string;
              };
              Attachment?: {
                AttachTime: string;
                AttachmentId: string;
                DeleteOnTermination: boolean;
                DeviceIndex: number;
                Status: string;
                NetworkCardIndex?: number;
              };
              Description?: string;
              Groups: { GroupId: string; GroupName: string }[];
              Ipv6Addresses?: any[];
              MacAddress: string;
              NetworkInterfaceId: string;
              OwnerId: string;
              PrivateDnsName: string;
              PrivateIpAddress: string;
              PrivateIpAddresses: {
                Association?: {
                  IpOwnerId?: string;
                  PublicDnsName?: string;
                  PublicIp?: string;
                };
                Primary: boolean;
                PrivateDnsName: string;
                PrivateIpAddress: string;
              }[];
              SourceDestCheck: boolean;
              Status: string;
              SubnetId: string;
              VpcId: string;
              InterfaceType: string;
              Operator?: { Managed: boolean };
            }[];
            Tags?: { Key: string; Value: string }[];
          }[];
        }[];
      };
    return result.Reservations.flatMap((r) => r.Instances);
  } catch (e: any) {
    e.command = "aws ec2 describe-instances --output json";
    throw e;
  }
}, 30_000);

export const awsEc2DescribeInstance = memo(
  async (instanceId: string, format: "json" | "yaml" = "json") => {
    try {
      if (format === "yaml") {
        return await $`aws ec2 describe-instances --instance-ids='${instanceId}' --output yaml`.text();
      } else {
        const result =
          (await $`aws ec2 describe-instances --instance-ids='${instanceId}' --output json`.json()) as {
            Reservations: {
              Instances: {
                InstanceId: string;
                ImageId: string;
                State: { Code: number; Name: string };
                PrivateDnsName?: string;
                PublicDnsName?: string;
                InstanceType: string;
                LaunchTime: string;
                Placement: {
                  AvailabilityZone: string;
                  GroupName: string;
                  Tenancy: string;
                };
                Monitoring: { State: string };
                SubnetId?: string;
                VpcId?: string;
                PrivateIpAddress?: string;
                PublicIpAddress?: string;
                Architecture: string;
                RootDeviceType: string;
                RootDeviceName: string;
                Hypervisor: string;
                EnaSupport: boolean;
                EbsOptimized: boolean;
                ClientToken?: string;
                BlockDeviceMappings?: {
                  DeviceName: string;
                  Ebs: {
                    VolumeId: string;
                    Status: string;
                    AttachTime: string;
                    DeleteOnTermination: boolean;
                  };
                }[];
                NetworkInterfaces?: {
                  Association?: {
                    IpOwnerId?: string;
                    PublicDnsName?: string;
                    PublicIp?: string;
                  };
                  Attachment?: {
                    AttachTime: string;
                    AttachmentId: string;
                    DeleteOnTermination: boolean;
                    DeviceIndex: number;
                    Status: string;
                    NetworkCardIndex?: number;
                  };
                  Description?: string;
                  Groups: { GroupId: string; GroupName: string }[];
                  Ipv6Addresses?: any[];
                  MacAddress: string;
                  NetworkInterfaceId: string;
                  OwnerId: string;
                  PrivateDnsName: string;
                  PrivateIpAddress: string;
                  PrivateIpAddresses: {
                    Association?: {
                      IpOwnerId?: string;
                      PublicDnsName?: string;
                      PublicIp?: string;
                    };
                    Primary: boolean;
                    PrivateDnsName: string;
                    PrivateIpAddress: string;
                  }[];
                  SourceDestCheck: boolean;
                  Status: string;
                  SubnetId: string;
                  VpcId: string;
                  InterfaceType: string;
                  Operator?: { Managed: boolean };
                }[];
                Tags?: { Key: string; Value: string }[];
              }[];
            }[];
          };
        return result.Reservations[0].Instances[0];
      }
    } catch (e: any) {
      e.command = `aws ec2 describe-instances --instance-ids='${instanceId}' --output json`;
      throw e;
    }
  },
  30_000,
);

export const awsEc2GetConsoleOutput = memo(async (instanceId: string) => {
  try {
    const result =
      await $`aws ec2 get-console-output --latest --instance-id='${instanceId}' --output text`.text();
    return result;
  } catch (e: any) {
    e.command = `aws ec2 get-console-output --latest --instance-id='${instanceId}' --output text`;
    throw e;
  }
}, 30_000);

export const awsEc2DescribeSecurityGroups = memo(async () => {
  try {
    const result =
      (await $`aws ec2 describe-security-groups --output json`.json()) as {
        SecurityGroups: {
          Description: string;
          GroupName: string;
          IpPermissions: {
            FromPort?: number;
            ToPort?: number;
            IpProtocol: string;
            IpRanges: { CidrIp: string; Description?: string }[];
            Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
            PrefixListIds: { PrefixListId: string; Description?: string }[];
            UserIdGroupPairs: {
              GroupId: string;
              GroupName?: string;
              VpcId?: string;
            }[];
          }[];
          OwnerId: string;
          GroupId: string;
          VpcId?: string;
          Tags?: { Key: string; Value: string }[];
          SecurityGroupArn: string;
          IpPermissionsEgress?: {
            FromPort?: number;
            ToPort?: number;
            IpProtocol: string;
            IpRanges: { CidrIp: string; Description?: string }[];
            Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
            PrefixListIds: { PrefixListId: string; Description?: string }[];
            UserIdGroupPairs: {
              GroupId: string;
              GroupName?: string;
              VpcId?: string;
            }[];
          }[];
        }[];
      };
    return result.SecurityGroups;
  } catch (e: any) {
    e.command = "aws ec2 describe-security-groups --output json";
    throw e;
  }
}, 30_000);

export const awsEc2DescribeSecurityGroup = memo(
  async (groupIdOrGroupName: string, format: "json" | "yaml" = "json") => {
    const isId = groupIdOrGroupName.startsWith("sg-");
    const flag = isId ? "--group-ids" : "--group-names";
    try {
      if (format === "yaml") {
        return await $`aws ec2 describe-security-groups ${flag}='${groupIdOrGroupName}' --output yaml`.text();
      } else {
        const result =
          (await $`aws ec2 describe-security-groups ${flag}='${groupIdOrGroupName}' --output json`.json()) as {
            SecurityGroups: {
              Description: string;
              GroupName: string;
              IpPermissions: {
                FromPort?: number;
                ToPort?: number;
                IpProtocol: string;
                IpRanges: { CidrIp: string; Description?: string }[];
                Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
                PrefixListIds: { PrefixListId: string; Description?: string }[];
                UserIdGroupPairs: {
                  GroupId: string;
                  GroupName?: string;
                  VpcId?: string;
                }[];
              }[];
              OwnerId: string;
              GroupId: string;
              VpcId?: string;
              Tags?: { Key: string; Value: string }[];
              SecurityGroupArn: string;
              IpPermissionsEgress?: {
                FromPort?: number;
                ToPort?: number;
                IpProtocol: string;
                IpRanges: { CidrIp: string; Description?: string }[];
                Ipv6Ranges: { CidrIpv6: string; Description?: string }[];
                PrefixListIds: { PrefixListId: string; Description?: string }[];
                UserIdGroupPairs: {
                  GroupId: string;
                  GroupName?: string;
                  VpcId?: string;
                }[];
              }[];
            }[];
          };
        return result.SecurityGroups[0];
      }
    } catch (e: any) {
      e.command = `aws ec2 describe-security-groups ${flag}='${groupIdOrGroupName}' --output json`;
      throw e;
    }
  },
  30_000,
);

export const awsEc2DescribeVpc = memo(
  async (vpcId: string, format: "json" | "yaml" = "json") => {
    try {
      if (format === "yaml") {
        return await $`aws ec2 describe-vpcs --vpc-ids='${vpcId}' --output yaml`.text();
      } else {
        const result =
          (await $`aws ec2 describe-vpcs --vpc-ids='${vpcId}' --output json`.json()) as {
            Vpcs: {
              OwnerId: string;
              VpcId: string;
              State: string;
              CidrBlock: string;
              DhcpOptionsId: string;
              InstanceTenancy: string;
              CidrBlockAssociationSet?: {
                AssociationId: string;
                CidrBlock: string;
                CidrBlockState: { State: string };
              }[];
              IsDefault: boolean;
              Tags?: { Key: string; Value: string }[];
            }[];
          };
        return result.Vpcs[0];
      }
    } catch (e: any) {
      e.command = `aws ec2 describe-vpcs --vpc-ids='${vpcId}' --output json`;
      throw e;
    }
  },
  30_000,
);

export const awsIamListUsers = memo(async () => {
  try {
    const result = (await $`aws iam list-users --output json`.json()) as {
      Users: {
        Path: string;
        UserName: string;
        UserId: string;
        Arn: string;
        CreateDate: string;
        Tags?: { Key: string; Value: string }[];
      }[];
    };
    return result.Users;
  } catch (e: any) {
    e.command = "aws iam list-users --output json";
    throw e;
  }
}, 30_000);

export const awsCfGetTemplate = memo(async (stackName: string) => {
  try {
    const result =
      await $`aws cloudformation get-template --stack-name='${stackName}' --output json`.json();
    return result.TemplateBody! as string;
  } catch (e: any) {
    e.command = `aws cloudformation get-template --stack-name='${stackName}' --output json`;
    throw e;
  }
}, 30_000);

export const awsCfDescribeStackEvents = memo(async (stackName: string) => {
  try {
    const result =
      (await $`aws cloudformation describe-stack-events --stack-name='${stackName}' --output json`.json()) as {
        StackEvents: {
          StackId: string;
          EventId: string;
          StackName: string;
          LogicalResourceId: string;
          PhysicalResourceId?: string;
          ResourceType: string;
          Timestamp: string;
          ResourceStatus: string;
          ResourceStatusReason?: string;
          ResourceProperties?: string;
          ClientRequestToken?: string;
        }[];
      };
    return result.StackEvents || [];
  } catch (e: any) {
    e.command = `aws cloudformation describe-stack-events --stack-name='${stackName}' --output json`;
    throw e;
  }
}, 5_000);

export const awsEcsDescribeClusters = memo(async () => {
  try {
    const list = (await $`aws ecs list-clusters --output json`.json()) as {
      clusterArns: string[];
    };
    let described =
      (await $`aws ecs describe-clusters --clusters ${{ raw: list.clusterArns.join(" ") }} --include STATISTICS --include TAGS --output json`.json()) as {
        clusters: {
          clusterArn: string;
          clusterName: string;
          status: string;
          registeredContainerInstancesCount: number;
          runningTasksCount: number;
          pendingTasksCount: number;
          activeServicesCount: number;
          statistics?: { name: string; value: string }[];
          tags?: { key: string; value: string }[];
          createdAt?: string;
        }[];
        failures?: any[];
      };

    return described.clusters.map((c) => ({
      ...c,
      registeredContainerInstancesCount: String(
        c.registeredContainerInstancesCount,
      ),
      runningTasksCount: String(c.runningTasksCount),
      pendingTasksCount: String(c.pendingTasksCount),
      pendingRunning: `${c.pendingTasksCount}/${c.runningTasksCount}`,
      activeServicesCount: String(c.activeServicesCount),
    }));
  } catch (e: any) {
    e.command = "aws ecs describe-clusters";
    throw e;
  }
}, 30_000);

export const awsEcsListServices = memo(async (clusterArn: string) => {
  try {
    const list =
      (await $`aws ecs list-services --cluster '${clusterArn}' --output json`.json()) as {
        serviceArns: string[];
      };
    const described =
      (await $`aws ecs describe-services --cluster '${clusterArn}' --services ${{ raw: list.serviceArns.join(" ") }} --output json`.json()) as {
        services: {
          serviceArn: string;
          serviceName: string;
          status: string;
          desiredCount: number;
          runningCount: number;
          pendingCount: number;
          launchType?: string;
          platformVersion?: string;
          tags?: { key: string; value: string }[];
          createdAt?: string;
          roleArn?: string;
        }[];
        failures?: any[];
      };
    return described.services.map((s) => ({
      ...s,
      desiredCount: String(s.desiredCount),
      runningCount: String(s.runningCount),
      pendingRunning: `${s.pendingCount}/${s.runningCount}`,
    }));
  } catch (e: any) {
    e.command = `aws ecs list-services --cluster '${clusterArn}' --output json`;
    throw e;
  }
}, 30_000);

export const awsEcsListTasks = memo(
  async (clusterArn: string, serviceName?: string) => {
    try {
      let list: { taskArns: string[] };
      if (serviceName) {
        list =
          await $`aws ecs list-tasks --cluster '${clusterArn}' --service-name '${serviceName}' --output json`.json();
      } else {
        list =
          await $`aws ecs list-tasks --cluster '${clusterArn}' --output json`.json();
      }

      const described =
        (await $`aws ecs describe-tasks --cluster '${clusterArn}' --tasks ${{ raw: list.taskArns.join(" ") }} --output json`.json()) as {
          tasks: {
            taskArn: string;
            lastStatus: string;
            desiredStatus: string;
            group: string;
            containers: {
              containerArn: string;
              lastStatus: string;
              name: string;
              exitCode?: number;
              reason?: string;
            }[];
            startedAt?: string;
            stoppedAt?: string;
            stoppedReason?: string;
            pullStartedAt?: string;
            pullStoppedAt?: string;
            connectivity?: string;
            connectivityAt?: string;
            tags?: { key: string; value: string }[];
          }[];
        };
      return described.tasks.map((t) => ({
        ...t,
        id: t.taskArn.split("/").pop()!,
        lastStatus: t.lastStatus,
        desiredStatus: t.desiredStatus,
      }));
    } catch (e: any) {
      e.command = serviceName
        ? `aws ecs list-tasks --cluster '${clusterArn}' --service-name '${serviceName}' --output json`
        : `aws ecs list-tasks --cluster '${clusterArn}' --output json`;
      throw e;
    }
  },
  30_000,
);

export const awsUrls: Record<string, (id: string) => Promise<string>> = {
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
    return `https://console.aws.amazon.com/ecs/v2/clusters/${encodeURIComponent(arn.split("/").pop() || arn)}/services?region=${region}`;
  },
};
