import { execFile } from "node:child_process";
import { promisify } from "node:util";
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

/* ---------- helpers ---------- */

async function tmux(args: string[]) {
  return execFileP("tmux", args, { maxBuffer: 1024 * 1024 });
}
