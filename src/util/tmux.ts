import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join, basename } from "path";
import { setTmuxPopupVisible } from "../store";

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

  await tmux(["display-popup", "-E", "-w95%", "-h95%", ...command]);
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
