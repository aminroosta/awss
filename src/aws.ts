import { $ } from "bun";

export const awsRegion = async () => {
  let region = '';
  try {
    region = await $`aws configure get region`.text()
  } catch (e: any) {
    e.command = 'aws configure get region'
    throw e;
  }
  return region.trim();
};

export const awsCallerIdentity = async () => {
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
};

export const awsCliVersion = async () => {
  let version = '';
  try {
    version = await $`aws --version`.text()
  } catch (e: any) {
    e.command = 'aws --version'
    throw e;
  }
  return /aws-cli\/([^\s]+)/.exec(version)![1]!;
};

export const awsListBuckets = async () => {
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
};

export const awsListStacks = async () => {
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
};
