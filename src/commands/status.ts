import { StateManager } from '../core/state-manager.js';
import { logger } from '../utils/logger.js';
import { STAGE_ORDER } from '../types.js';
import chalk from 'chalk';

export async function status(projectDir: string): Promise<void> {
  try {
    const manager = new StateManager(projectDir);
    const state = await manager.load();

    if (!state.active) {
      logger.info('流水线未启动。请先运行 `flowcompass run <command>` 开始。');
      return;
    }

    logger.info(`Current stage: ${chalk.bold(state.current_command)}`);
    logger.info(`Tool: ${state.tool} | Mode: ${state.mode} | Iteration: ${state.context.iteration}`);
    logger.info('');

    for (const stage of STAGE_ORDER) {
      const stageState = state.stages[stage];
      if (!stageState) continue;
      let icon: string;
      let label: string;

      switch (stageState.status) {
        case 'completed':
          icon = chalk.green('✔');
          label = chalk.green('completed');
          break;
        case 'in_progress':
          icon = chalk.blue('►');
          label = chalk.blue('in_progress');
          break;
        case 'failed':
          icon = chalk.red('✖');
          label = chalk.red('failed');
          break;
        default:
          icon = chalk.gray('○');
          label = chalk.gray('pending');
      }

      logger.info(`  ${icon} ${stage.padEnd(16)} ${label}`);
      if (stageState.completed_at) {
        logger.info(`    ${chalk.gray('completed: ' + stageState.completed_at)}`);
      }

      if (stageState.skills.length > 0 && stageState.status !== 'pending') {
        for (let i = 0; i < stageState.skills.length; i++) {
          const skill = stageState.skills[i];
          let sIcon: string;
          switch (skill.status) {
            case 'completed': sIcon = chalk.green('  ✔'); break;
            case 'in_progress': sIcon = chalk.blue('  ►'); break;
            case 'failed': sIcon = chalk.red('  ✖'); break;
            default: sIcon = chalk.gray('  ○');
          }
          logger.info(`    ${sIcon} ${skill.skill_name}`);
          if (skill.error_message) {
            logger.info(`      ${chalk.red('error: ' + skill.error_message)}`);
          }
        }
      }
    }
  } catch (err) {
    logger.error(`状态查询失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
