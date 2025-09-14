import { spawn } from "child_process";
import { writeFileSync, unlinkSync, readFileSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join, basename } from "path";
import { setVimVisible } from "../store";

export async function openInVim(
  content: string,
  filename: string,
): Promise<string> {
  const tempDir = join(tmpdir(), "awss");
  mkdirSync(tempDir, { recursive: true });
  const tempFile = join(tempDir, basename(filename));
  writeFileSync(tempFile, content);

  const stdin: any = process.stdin;
  const wasRaw = !!stdin.isRaw;
  const wasPaused = stdin.isPaused();

  try {
    if (stdin.isTTY && typeof stdin.setRawMode === "function" && wasRaw) {
      stdin.setRawMode(false);
    }
    if (!wasPaused) {
      stdin.pause();
    }

    setVimVisible(true);
    const vim = spawn("nvim", [tempFile], { stdio: "inherit" });
    await new Promise<void>((resolve) => {
      vim.once("exit", () => {
        resolve();
      });
      vim.once("error", (err) => {
        console.error("Failed to start vim:", err);
        resolve();
      });
    });
  } finally {
    if (!wasPaused) {
      stdin.resume();
    }
    if (stdin.isTTY && typeof stdin.setRawMode === "function" && wasRaw) {
      stdin.setRawMode(true);
    }
    setVimVisible(false);
  }

  const updatedContent = readFileSync(tempFile, "utf-8");
  unlinkSync(tempFile);
  return updatedContent;
}
