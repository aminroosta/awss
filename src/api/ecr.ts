import { aws } from "./aws";

export const awsEcrDescribeRepositories = async () => {
  type DescribeRepositories = {
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
  const result = await aws<DescribeRepositories>(
    `aws ecr describe-repositories`,
  );
  return result.repositories;
};

export const awsEcrListImages = async (repositoryName: string) => {
  type ListImages = {
    imageIds: {
      imageDigest?: string;
      imageTag?: string;
    }[];
  };
  const result = await aws<ListImages>(
    `aws ecr list-images --repository-name='${repositoryName}'`,
  );
  return result.imageIds;
};
