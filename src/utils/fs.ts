import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import fg from 'fast-glob';

const SENSITIVE_PATTERNS = ['.env', '.env.', '.git', '.DS_Store'];

export function ensureDir(dirPath: string) {
  mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

export function writeText(filePath: string, content: string) {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, 'utf-8');
}

export function copyDir(src: string, dest: string, transform?: (content: string, filePath: string) => string) {
  const entries = fg.sync('**/*', { cwd: src, onlyFiles: true, dot: true, ignore: SENSITIVE_PATTERNS });
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    let content = readText(srcPath);
    if (transform) {
      content = transform(content, entry);
    }
    writeText(destPath, content);
  }
}

export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}
