import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import fg from 'fast-glob';

export const KNOWLEDGE_DIR = '.knowledge';

const SENSITIVE_PATTERNS = ['.env', '.env.', '.git', '.DS_Store'];

function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

export function readText(filePath: string): string {
  return readFileSync(filePath, 'utf-8');
}

export function writeText(filePath: string, content: string): void {
  ensureDir(dirname(filePath));
  writeFileSync(filePath, content, 'utf-8');
}

export function copyDir(
  src: string,
  dest: string,
  transform?: (content: string, filePath: string) => string,
  pathTransform?: (relativePath: string) => string,
): void {
  const entries = fg.sync('**/*', { cwd: src, onlyFiles: true, dot: true, ignore: SENSITIVE_PATTERNS });
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, pathTransform ? pathTransform(entry) : entry);
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

export function acquireLock(lockPath: string): boolean {
  ensureDir(dirname(lockPath));
  try {
    writeFileSync(lockPath, String(process.pid), { flag: 'wx' });
    return true;
  } catch {
    return false;
  }
}

export function releaseLock(lockPath: string): void {
  try {
    unlinkSync(lockPath);
  } catch (err) {
    // Lock file may already be gone (race or manual cleanup) — not fatal
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err;
    }
  }
}

export function countSubdirs(dirPath: string): number {
  if (!existsSync(dirPath)) return 0;
  return readdirSync(dirPath, { withFileTypes: true }).filter((e) => e.isDirectory()).length;
}

export function countFiles(dirPath: string, ext: string): number {
  if (!existsSync(dirPath)) return 0;
  return readdirSync(dirPath, { withFileTypes: true }).filter((e) => e.isFile() && e.name.endsWith(ext)).length;
}
