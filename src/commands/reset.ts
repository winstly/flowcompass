import { StateManager } from '../core/state-manager.js';
import { isInteractive } from '../core/tools.js';
import { logger } from '../utils/logger.js';

export async function reset(projectDir: string): Promise<void> {
  try {
    const manager = new StateManager(projectDir);
    const state = await manager.load();

    if (state.active && isInteractive()) {
      const { confirm } = await import('@inquirer/prompts');
      const yes = await confirm({
        message: '确定要重置所有流水线状态吗？此操作不可撤销。',
        default: false,
      });
      if (!yes) {
        logger.info('已取消重置。');
        return;
      }
    }

    await manager.reset(state.tool, state.mode);
    logger.success('Pipeline state has been reset.');
  } catch (err) {
    logger.error(`重置失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
