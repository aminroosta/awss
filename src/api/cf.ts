import { aws } from "./aws";

export const awsListStacks = async () => {
  type ListStacks = {
    StackSummaries: {
      StackName: string;
      StackStatus: string;
      CreationTime: string;
      StackId: string;
    }[];
  };
  const result = await aws<ListStacks>("aws cloudformation list-stacks");
  return result.StackSummaries.sort((a, b) =>
    a.StackStatus.localeCompare(b.StackStatus),
  );
};

export const awsCfListStackResources = (stackName: string) => {
  type ListStackResources = {
    StackResourceSummaries: {
      LogicalResourceId: string;
      PhysicalResourceId: string;
      ResourceType: string;
      LastUpdatedTimestamp: string;
      ResourceStatus: string;
    }[];
  };
  return aws<ListStackResources>(
    `aws cloudformation list-stack-resources --stack-name='${stackName}'`
  );
};

export const awsCfDescribeStack = async (stackName: string) => {
  type DescribeStack = {
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
  const result = await aws<DescribeStack>(
    `aws cloudformation describe-stacks --stack-name='${stackName}'`
  );
  return result.Stacks[0]!;
};
