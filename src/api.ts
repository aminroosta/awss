import { exec } from "child_process";
import { promisify } from "util";
import { memo } from "./util/memo";
const execute = promisify(exec);

async function shellText(command: string) {
  try {
    const { stdout, stderr } = await execute(command);
    return stdout.trim();
  } catch (err: any) {
    err.command = command;
    throw err;
  }
}

async function shell<R>(command: string) {
  try {
    const { stdout, stderr } = await execute(command);
    return JSON.parse(stdout) as R;
  } catch (err: any) {
    err.command = command;
    throw err;
  }
}

export const awsRegion = memo(() => shellText("aws configure get region"));

export const awsCallerIdentity = memo(() =>
  shell<{ UserId: string; Account: string; Arn: string }>(
    "aws sts get-caller-identity --output json",
  ),
);
