import { listCommands } from '../core/command-resolver.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export async function list(configDir: string): Promise<void> {
  try {
    const commands = await listCommands(configDir);

    logger.info('flowcompass — 8 阶段软件工程全生命周期');
    logger.info('');

    for (const cmd of commands) {
      const skills = cmd.skills.length > 0 ? cmd.skills.join(', ') : '（预留）';
      const gate = cmd['handoff-policy'] === 'approval-required' ? chalk.yellow('🔒') : chalk.green('auto');
      logger.info(`  ${chalk.bold(cmd.name.padEnd(16))} ${cmd.stage.padEnd(8)} ${gate}  ${chalk.gray(skills)}`);
    }
  } catch (err) {
    logger.error(`列表查询失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
