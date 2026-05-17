import { logger } from '../utils/logger.js';
import { fileExists } from '../utils/fs.js';
import { join } from 'node:path';

export async function lint(projectDir: string): Promise<void> {
  try {
    let issues = 0;

    const wikiIndex = join(projectDir, '.knowledge', 'wiki', 'index.md');
    if (!fileExists(wikiIndex)) {
      logger.warn('wiki/index.md not found — Wiki 知识库未初始化');
      issues++;
    }

    const stateFile = join(projectDir, '.knowledge', 'state.json');
    if (!fileExists(stateFile)) {
      logger.warn('.knowledge/state.json not found — 流水线未初始化');
      issues++;
    }

    if (issues === 0) {
      logger.success('All checks passed.');
    } else {
      logger.error(`${issues} issue(s) found.`);
      process.exitCode = 1;
    }
  } catch (err) {
    logger.error(`Lint 失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
