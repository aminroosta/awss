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
