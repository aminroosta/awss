import { $ } from "bun";
import { log } from "./util/log";
import { memo } from "./util/memo";

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
};

export const awsRegion = memo(async () => {
  let region = "";
  try {
    region = await $`aws configure get region`.text();
  } catch (e: any) {
    e.command = "aws configure get region";
    throw e;
  }
  return region.trim();
});

export const awsCallerIdentity = memo(async () => {
  try {
    return (await $`aws sts get-caller-identity --output json`.json()) as {
      UserId: string;
      Account: string;
      Arn: string;
    };
  } catch (e: any) {
    e.command = "aws sts get-caller-identity";
    throw e;
  }
});

export const awsCliVersion = memo(async () => {
  let version = "";
  try {
    version = await $`aws --version`.text();
  } catch (e: any) {
    e.command = "aws --version";
    throw e;
  }
  return /aws-cli\/([^\s]+)/.exec(version)![1]!;
});

export const awsListBuckets = memo(async () => {
  try {
    let result = (await $`aws s3api list-buckets --output json`.json()) as {
      Buckets: { Name: string; CreationDate: string }[];
      Owner: { DisplayName: string; ID: string };
    };
    const nameLen = Math.max(...result.Buckets.map((b) => b.Name.length));
    for (let bucket of result.Buckets) {
      bucket.Name = bucket.Name.padEnd(nameLen, " ");
      bucket.CreationDate = bucket.CreationDate.split("T")[0]!;
    }
    return result;
  } catch (e: any) {
    e.command = "aws s3api list-buckets --output json";
    throw e;
  }
});

export const awsListStacks = memo(async () => {
  try {
    const result =
      (await $`aws cloudformation list-stacks --output json`.json()) as {
        StackSummaries: {
          StackId: string;
          StackName: string;
          CreationTime: string;
          StackStatus: string;
        }[];
      };
    return result.StackSummaries;
  } catch (e: any) {
    e.command = "aws cloudformation list-stacks --output json";
    throw e;
  }
});

export const awsListObjectsV2 = memo(
  async (bucket: string, prefix: string, delimiter = "/") => {
    try {
      return (await $`aws s3api list-objects-v2 --bucket='${bucket}' --delimiter='${delimiter}' --prefix='${prefix}' --output=json`.json()) as {
        Contents: {
          Key: string;
          LastModified: string;
          Size: number;
          StorageClass: string;
          ETag: string;
          ChecksumType: string;
          ChecksumAlgorithm: string[];
        }[];
        CommonPrefixes?: { Prefix: string }[];
        Prefix?: string;
        // RequestCharged: string | null;
      };
    } catch (e: any) {
      e.command = `aws s3api list-objects-v2 --bucket='${bucket}' --delimiter='${delimiter}' --prefix='${prefix}' --output=json`;
      throw e;
    }
  },
  30_000,
);

export const awsListObjectsV2Search = memo(
  async (
    bucket: string,
    search: string,
    prefix: string = "",
    continuationToken: string | undefined = undefined,
    maxKeys: number = 1000,
  ) => {
    if (!search.trim()) {
      return { Contents: [] };
    }
    const words = search.trim().split(/\s+/);
    const queryFilter = words
      .map((w) => `contains(Key, \`${w}\`)`)
      .join(" || ");

    try {
      const result = (await (continuationToken
        ? $`aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --continuation-token='${continuationToken}' --output=json`.json()
        : $`aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --output=json`.json())) as {
        Objects: {
          Key: string;
          LastModified: string;
          Size: number;
          StorageClass: string;
        }[];
        NextToken?: string;
      };
      return { Contents: result.Objects, NextToken: result.NextToken };
    } catch (e: any) {
      e.command = continuationToken
        ? `aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --continuation-token='${continuationToken}' --output=json`
        : `aws s3api list-objects-v2 --bucket='${bucket}' --prefix='${prefix}' --max-keys=${maxKeys} --query "{Objects: Contents[?${queryFilter}], NextToken: NextContinuationToken}" --output=json`;
      throw e;
    }
  },
  30_000,
);

export const awsS3GetObject = memo(async (bucket: string, key: string) => {
  try {
    return await $`aws s3 cp 's3://${bucket}/${key}' -`.text();
  } catch (e: any) {
    e.command = `aws s3 cp --bucket='${bucket}' --key='${key}' -`;
    throw e;
  }
}, 30_000);

export const awsCfListStackResources = memo(async (stackName: string) => {
  try {
    return (await $`aws cloudformation list-stack-resources --stack-name='${stackName}' --output json`.json()) as {
      StackResourceSummaries: {
        LogicalResourceId: string;
        PhysicalResourceId: string;
        ResourceType: string;
        LastUpdatedTimestamp: string;
        ResourceStatus: string;
      }[];
    };
  } catch (e: any) {
    e.command = `aws cloudformation list-stack-resources --stack-name='${stackName}' --output json`;
    throw e;
  }
}, 30_000);

export const awsCfDescribeStack = memo(async (stackName: string) => {
  try {
    const result =
      (await $`aws cloudformation describe-stacks --stack-name='${stackName}' --output json`.json()) as {
        Stacks: {
          StackId: string;
          StackName: string;
          Description?: string;
          Parameters: { ParameterKey: string; ParameterValue: string }[];
          CreationTime: string;
          RollbackConfiguration: {
            RollbackTriggers: [];
          };
          StackStatus: string;
          DisableRollback: boolean;
          NotificationARNs: string[];
          Tags: { Key: string; Value: string }[];
          EnableTerminationProtection: boolean;
        }[];
      };
    return result.Stacks[0]!;
  } catch (e: any) {
    e.command = `aws cloudformation describe-stacks --stack-name='${stackName}' --output json`;
    throw e;
  }
}, 30_000);

export const awsEc2DescribeVpcs = memo(async () => {
  try {
    let result = (await $`aws ec2 describe-vpcs --output json`.json()) as {
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
    return result.Vpcs;
  } catch (e: any) {
    e.command = "aws ec2 describe-vpcs --output json";
    throw e;
  }
}, 30_000);

export const awsEc2DescribeSubnets = memo(async () => {
  try {
    const result = (await $`aws ec2 describe-subnets --output json`.json()) as {
      Subnets: {
        SubnetId: string;
        VpcId: string;
        State: string;
        CidrBlock: string;
        AvailabilityZone: string;
        AvailabilityZoneId: string;
        AvailableIpAddressCount: number;
        DefaultForAz: boolean;
        MapPublicIpOnLaunch: boolean;
        OwnerId: string;
        AssignIpv6AddressOnCreation: boolean;
        Ipv6CidrBlockAssociationSet?: {
          AssociationId: string;
          Ipv6CidrBlock: string;
          Ipv6CidrBlockState: { State: string };
        }[];
        Tags?: { Key: string; Value: string }[];
      }[];
    };
    return result.Subnets;
  } catch (e: any) {
    e.command = "aws ec2 describe-subnets --output json";
    throw e;
  }
}, 30_000);

export const awsEc2DescribeSubnet = memo(
  async (subnetId: string, format: "json" | "yaml" = "json") => {
    try {
      if (format === "yaml") {
        return await $`aws ec2 describe-subnets --subnet-ids='${subnetId}' --output yaml`.text();
      } else {
        const result =
          (await $`aws ec2 describe-subnets --subnet-ids='${subnetId}' --output json`.json()) as {
            Subnets: {
              SubnetId: string;
              VpcId: string;
              State: string;
              CidrBlock: string;
              AvailabilityZone: string;
              AvailabilityZoneId: string;
              AvailableIpAddressCount: number;
              DefaultForAz: boolean;
              MapPublicIpOnLaunch: boolean;
              OwnerId: string;
              AssignIpv6AddressOnCreation: boolean;
              Ipv6CidrBlockAssociationSet?: {
                AssociationId: string;
                Ipv6CidrBlock: string;
                Ipv6CidrBlockState: { State: string };
              }[];
              Tags?: { Key: string; Value: string }[];
            }[];
          };
        return result.Subnets[0];
      }
    } catch (e: any) {
      e.command = `aws ec2 describe-subnets --subnet-ids='${subnetId}' --output json`;
      throw e;
    }
  },
  30_000,
);

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
