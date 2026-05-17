import { SubAgentRunner } from '../core/subagent-runner.js';
import { resolveCommand } from '../core/command-resolver.js';
import { assertStageName } from '../core/pipeline.js';
import { logger } from '../utils/logger.js';
import type { ToolId } from '../types.js';
import chalk from 'chalk';

export async function run(
  projectDir: string,
  configDir: string,
  commandName: string,
  tool: ToolId = 'claude',
  force: boolean = false,
): Promise<void> {
  try {
    const stage = assertStageName(commandName);
    const cmd = await resolveCommand(commandName, configDir);

    logger.info(`启动阶段: ${chalk.bold(cmd.stage)} (${commandName})`);
    logger.info(`模型: ${cmd.model} | 级别: ${cmd.level} | 门控: ${cmd['handoff-policy']}`);
    logger.info('');

    if (cmd.skills.length === 0) {
      logger.warn(`${cmd.stage}阶段暂无 Skill，将自动标记为完成。`);
    } else {
      logger.info('将按顺序执行以下 Skill：');
      for (let i = 0; i < cmd.skills.length; i++) {
        logger.info(`  ${i + 1}. ${chalk.cyan(cmd.skills[i])}`);
      }
      logger.info('');

      const gateLabel = cmd['handoff-policy'] === 'approval-required'
        ? chalk.yellow('approval-required — 阶段完成后需用户确认')
        : chalk.green('auto — 阶段完成后自动推进');
      logger.info(`Handoff: ${gateLabel}`);
      logger.info(`Next: ${cmd['pipeline-next']}`);
      logger.info('');
    }

    const runner = new SubAgentRunner(projectDir, configDir, tool, force);
    try {
      await runner.execute(commandName);
    } finally {
      runner.dispose();
    }
  } catch (err) {
    logger.error(`执行失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
