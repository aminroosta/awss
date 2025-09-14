import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  accessSync,
  constants,
  openSync,
  closeSync,
} from "fs";
import { tmpdir } from "os";
import { join, basename } from "path";
import { setVimVisible } from "../store";

import { runInTmuxPopup } from "./tmux";

export async function openInVim(content: string, filename: string) {
  const tempDir = join(tmpdir(), "awss");
  mkdirSync(tempDir, { recursive: true });
  const tempFile = join(tempDir, basename(filename) || "untitled.txt");
  writeFileSync(tempFile, content, "utf8");

  try {
    setVimVisible(true);
    await runInTmuxPopup(["nvim", tempFile]);
  } finally {
    setVimVisible(false);
  }
}
