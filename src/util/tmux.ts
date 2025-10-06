import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, basename } from "path";
import { setNotification, setTmuxPopupVisible } from "../store";
import { loadConfig } from "./config";

const execFileP = promisify(execFile);

export async function runInTmuxPopup(command: string[]) {
  const pane = process.env.TMUX_PANE;
  const error = new Error(
    "Please run inside tmux to unlock this functionality!",
  );
  if (!pane) {
    throw error;
  }

  await tmux(["has-session"]).catch(() => {
    throw new Error("tmux not available");
  });

  // await tmux(["display-popup", "-E", "-w95%", "-h95%", ...command]);
  await tmux(["split-window", "-h", "-P", "-F", "#{pane_id}", ...command]);
}

async function tmux(args: string[]) {
  return execFileP("tmux", args, { maxBuffer: 1024 * 1024 });
}

export async function openInVim(content: string, filename: string) {
  const tempDir = join(tmpdir(), "awss");
  mkdirSync(tempDir, { recursive: true });
  const tempFile = join(tempDir, basename(filename) || "untitled.txt");
  writeFileSync(tempFile, content, "utf8");

  try {
    setTmuxPopupVisible(true);
    await runInTmuxPopup(["nvim", tempFile]);
  } finally {
    setTmuxPopupVisible(false);
  }
}

export async function ecsExecPopup(
  cluster: string,
  task: string,
  container: string,
  command: string = "/bin/bash",
) {
  try {
    setTmuxPopupVisible(true);
    const args = [
      "aws",
      "ecs",
      "execute-command",
      "--cluster",
      cluster,
      "--task",
      task,
      "--container",
      container,
      "--interactive",
      "--cli-read-timeout",
      "5",
      "--cli-connect-timeout",
      "5",
      "--command",
      command,
    ];
    await runInTmuxPopup(args);
  } finally {
    setTmuxPopupVisible(false);
  }
}

export async function ec2Ssh(a: { PrivateDnsName: string }) {
  const config = loadConfig();
  if (!config.ssh) {
    setNotification({
      level: "error",
      message:
        "Missing SSH command. Create ~/.config/awss/config.json with { \"ssh\": \"ssh $PrivateDnsName\" }",
      timeout: 4000,
    });
    return;
  }
  const sshCmd = config.ssh!.replace(/\$PrivateDnsName/g, a.PrivateDnsName);
  await runInTmuxPopup(sshCmd.split(" ").filter((s) => s));
}
