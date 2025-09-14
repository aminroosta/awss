import { aws } from "./aws";

export const awsRegion = () => aws("aws configure get region", "text");

export const awsCallerIdentity = () =>
  aws<{ UserId: string; Account: string; Arn: string }>(
    "aws sts get-caller-identity",
  );

export const awsCliVersion = async () => {
  const version = await aws("aws --version", "text");
  return /aws-cli\/([^\s]+)/.exec(version)![1]!;
};
