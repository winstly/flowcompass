import chalk from 'chalk';
import { logger } from '../utils/logger.js';

export function showWelcome(): void {
  logger.info('');
  logger.info(chalk.cyan.bold('  ┌─────────────────────────────────────────────┐'));
  logger.info(chalk.cyan.bold('  │                                             │'));
  logger.info(chalk.cyan.bold('  │         flowcompass                        │'));
  logger.info(chalk.cyan.bold('  │         标准软件工程全生命周期工具             │'));
  logger.info(chalk.cyan.bold('  │                                             │'));
  logger.info(chalk.cyan.bold('  └─────────────────────────────────────────────┘'));
  logger.info('');
  logger.info(chalk.white('  8 阶段 Command/Skill 体系'));
  logger.info('');
  logger.info(chalk.dim('  investigation  → requirements → architecture → design'));
  logger.info(chalk.dim('  development     → testing      → deployment    → retrospective'));
  logger.info('');
  logger.info(chalk.white('  安装内容：'));
  logger.info(chalk.dim('  • Skills    — AI 工具技能文件（16 个）'));
  logger.info(chalk.dim('  • Commands  — /flowcompass:* 斜杠命令（8 个）'));
  logger.info(chalk.dim('  • Rules     — 工程规则文件'));
  logger.info('');
  logger.info(chalk.white('  安装后快速开始：'));
  logger.info(`  ${chalk.yellow('/flowcompass:investigation')}   ${chalk.dim('启动立项调研')}`);
  logger.info(`  ${chalk.yellow('flowcompass run investigation')}  ${chalk.dim('CLI 方式启动')}`);
  logger.info('');
}
