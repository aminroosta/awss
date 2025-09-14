import { exec } from "child_process";
import { promisify } from "util";
import { memo } from "./util/memo";
const execute = promisify(exec);

async function shellText(cmd: string) {
  try {
    const { stdout, stderr } = await execute(cmd);
    return stdout.trim();
  } catch (err: any) {
    err.command = cmd;
    throw err;
  }
}

async function shell<R>(cmd: string, no_suffix = false) {
  try {
    const args = no_suffix ? cmd : `${cmd} --output json`;
    const { stdout, stderr } = await execute(args);
    return JSON.parse(stdout) as R;
  } catch (err: any) {
    err.command = cmd;
    throw err;
  }
}

export const awsRegion = memo(() => shellText("aws configure get region"));

export const awsCallerIdentity = memo(() =>
  shell<{ UserId: string; Account: string; Arn: string }>(
    "aws sts get-caller-identity",
  ),
);

export const awsCliVersion = memo(async () => {
  const version = await shellText("aws --version");
  return /aws-cli\/([^\s]+)/.exec(version)![1]!;
});

export const awsListBuckets = memo(async () => {
  type R = { Buckets: { Name: string; CreationDate: string }[]; Owner: { DisplayName: string; ID: string } };
  const result = await shell<R>("aws s3api list-buckets");
  const maxLen = Math.max(...result.Buckets.map((b) => b.Name.length));
  for (let bucket of result.Buckets) {
    bucket.Name = bucket.Name.padEnd(maxLen, " ");
    bucket.CreationDate = bucket.CreationDate.split("T")[0]!;
  }
  return result;
});

export const awsListStacks = memo(async () => {
  type R = { StackSummaries: { StackName: string; StackStatus: string; CreationTime: string; StackId: string }[] };
  const result = await shell<R>("aws cloudformation list-stacks");
  return result.StackSummaries.sort((a, b) => a.StackStatus.localeCompare(b.StackStatus));
});
