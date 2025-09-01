import { $ } from "bun";
import { log } from "./util/log";
import { memo } from "./util/memo";

export const awsRegion = memo(async () => {
  let region = '';
  try {
    region = await $`aws configure get region`.text()
  } catch (e: any) {
    e.command = 'aws configure get region'
    throw e;
  }
  return region.trim();
});

export const awsCallerIdentity = memo(async () => {
  try {
    return await $`aws sts get-caller-identity --output json`.json() as {
      UserId: string;
      Account: string;
      Arn: string;
    };
  } catch (e: any) {
    e.command = 'aws sts get-caller-identity'
    throw e;
  }
});

export const awsCliVersion = memo(async () => {
  let version = '';
  try {
    version = await $`aws --version`.text()
  } catch (e: any) {
    e.command = 'aws --version'
    throw e;
  }
  return /aws-cli\/([^\s]+)/.exec(version)![1]!;
});

export const awsListBuckets = memo(async () => {
  try {
    let result = await $`aws s3api list-buckets --output json`.json() as {
      Buckets: { Name: string; CreationDate: string; }[];
      Owner: { DisplayName: string; ID: string; };
    };
    const nameLen = Math.max(...result.Buckets.map(b => b.Name.length))
    for (let bucket of result.Buckets) {
      bucket.Name = bucket.Name.padEnd(nameLen, ' ')
      bucket.CreationDate = bucket.CreationDate.split('T')[0]!
    }
    return result;
  } catch (e: any) {
    e.command = 'aws s3api list-buckets --output json'
    throw e;
  }
});

export const awsListStacks = memo(async () => {
  try {
    return await $`aws cloudformation list-stacks --output json`.json() as {
      StackSummaries: {
        StackId: string;
        StackName: string;
        CreationTime: string;
        StackStatus: string;
      }[];
    };
  } catch (e: any) {
    e.command = 'aws cloudformation list-stacks --output json'
    throw e;
  }
});

export const awsListObjectsV2 = memo(async (bucket: string, prefix: string, delimiter = '/') => {
  try {
    return await $`aws s3api list-objects-v2 --bucket='${bucket}' --delimiter='${delimiter}' --prefix='${prefix}' --output=json`.json() as {
      Contents: {
        Key: string;
        LastModified: string;
        Size: number;
        StorageClass: string;
        ETag: string;
        ChecksumType: string;
        ChecksumAlgorithm: string[];
      }[];
      CommonPrefixes?: { Prefix: string; }[];
      Prefix?: string;
      // RequestCharged: string | null;
    };
  } catch (e: any) {
    e.command = `aws s3api list-objects-v2 --bucket='${bucket}' --delimiter='${delimiter}' --prefix='${prefix}' --output=json`
    throw e;
  }
}, 30_000);

export const awsS3GetObject = memo(async (bucket: string, key: string) => {
  try {
    return await $`aws s3 cp 's3://${bucket}/${key}' -`.text();
  } catch (e: any) {
    e.command = `aws s3 cp --bucket='${bucket}' --key='${key}' -`
    throw e;
  }
}, 10_000);

export const awsCfListStackResources = (stackName: string) => memo(async () => {
  try {
    return await $`aws cloudformation list-stack-resources --stack-name='${stackName}' --output json`.json() as {
      StackResourceSummaries: {
        LogicalResourceId: string;
        PhysicalResourceId: string;
        ResourceType: string;
        LastUpdatedTimestamp: string;
        ResourceStatus: string;
      }[];
    };
  } catch (e: any) {
    e.command = `aws cloudformation list-stack-resources --stack-name='${stackName}' --output json`
    throw e;
  }
}, 10_000)();

export const awsCfDescribeStack = (stackName: string) => memo(async () => {
  try {
    const result = await $`aws cloudformation describe-stacks --stack-name='${stackName}' --output json`.json() as {
      Stacks: {
        StackId: string;
        StackName: string;
        Description?: string;
        Parameters: { ParameterKey: string; ParameterValue: string; }[];
        CreationTime: string;
        RollbackConfiguration: {
          RollbackTriggers: []
        },
        StackStatus: string;
        DisableRollback: boolean;
        NotificationARNs: string[];
        Tags: { Key: string; Value: string; }[];
        EnableTerminationProtection: boolean;
      }[];
    };
    return result.Stacks[0]!;
  } catch (e: any) {
    e.command = `aws cloudformation describe-stacks --stack-name='${stackName}' --output json`
    throw e;
  }
}, 10_000)();

export const awsEc2DescribeVpcs = memo(async () => {
  try {
    let result = await $`aws ec2 describe-vpcs --output json`.json() as {
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
    e.command = 'aws ec2 describe-vpcs --output json'
    throw e;
  }
}, 10_000);
