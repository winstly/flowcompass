import { existsSync } from 'node:fs';
import { logger } from '../utils/logger.js';
import { getAdapter } from '../core/adapters.js';
import { detectProjectTools } from '../core/tools.js';
import chalk from 'chalk';

export function status(projectDir: string): void {
  try {
    const detectedTools = detectProjectTools(projectDir);

    if (detectedTools.length === 0) {
      logger.info('未检测到已安装的 AI 工具。请先运行 `flowcompass install` 安装。');
      return;
    }

    logger.info(`已检测到 ${chalk.bold(detectedTools.length)} 个工具:`);
    logger.info('');

    for (const tool of detectedTools) {
      const adapter = getAdapter(tool.value);
      logger.info(`  ${chalk.cyan.bold(tool.name)} (${tool.mode})`);

      const dirs = [
        { label: 'skills', path: adapter.getSkillsDir(projectDir) },
        { label: 'commands', path: adapter.getCommandsDir(projectDir) },
        { label: 'rules', path: adapter.getRulesDir(projectDir) },
        { label: 'agents', path: adapter.getAgentsDir(projectDir) },
      ];

      for (const dir of dirs) {
        const exists = existsSync(dir.path);
        const icon = exists ? chalk.green('✔') : chalk.gray('○');
        logger.info(`    ${icon} ${dir.label}`);
      }

      logger.info('');
    }
  } catch (err) {
    logger.error(`Status query failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
