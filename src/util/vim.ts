import { spawn } from 'child_process';
import { writeFileSync, unlinkSync, readFileSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join, basename } from 'path';
import { setVimVisible } from '../store';

export async function openInVim(content: string, filename: string): Promise<string> {
  const tempDir = join(tmpdir(), 'awss');
  mkdirSync(tempDir, { recursive: true });
  const tempFile = join(tempDir, basename(filename));
  writeFileSync(tempFile, content);

  setVimVisible(true);
  const vim = spawn('nvim', [tempFile], { stdio: 'inherit' });
  await new Promise<void>((resolve) => {
    vim.on('exit', () => {
      resolve();
    });
    vim.on('error', (err) => {
      console.error('Failed to start vim:', err);
      resolve();
    });
  });
  setVimVisible(false);

  const updatedContent = readFileSync(tempFile, 'utf-8');
  unlinkSync(tempFile);
  return updatedContent;
}
