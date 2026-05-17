import { StateManager } from '../core/state-manager.js';
import { resolveCommand } from '../core/command-resolver.js';
import { Pipeline, assertStageName } from '../core/pipeline.js';
import { logger } from '../utils/logger.js';
import type { ToolId, StageName } from '../types.js';
import chalk from 'chalk';

const MAX_AUTO_ADVANCE_ITERATIONS = 8;

export async function next(
  projectDir: string,
  configDir: string,
  tool: ToolId = 'claude',
): Promise<void> {
  try {
    const manager = new StateManager(projectDir);
    const state = await manager.load(tool, 'cli');

    if (!state.active || !state.current_command) {
      logger.error('流水线未启动。请先运行 `flowcompass run <command>` 开始。');
      return;
    }

    const currentStage = assertStageName(state.current_command);
    const cmd = await resolveCommand(state.current_command, configDir);
    const pipeline = Pipeline.fromState(state);

    const stageState = state.stages[currentStage];
    if (!stageState) {
      logger.error(`阶段状态不存在: ${currentStage}`);
      return;
    }

    if (stageState.status === 'failed') {
      logger.error(`阶段 ${currentStage} 已失败，无法推进。请修复后使用 \`flowcompass run ${currentStage} --force\` 重试。`);
      return;
    }

    const hasFailedSkills = stageState.skills.some((s) => s.status === 'failed');
    if (hasFailedSkills) {
      logger.error(`阶段 ${currentStage} 有失败的 Skill，请修复后再推进。`);
      for (const skill of stageState.skills) {
        if (skill.status === 'failed') {
          logger.error(`  ✖ ${skill.skill_name}: ${skill.error_message}`);
        }
      }
      return;
    }

    // Guard: stage is still pending (prepared but not started)
    if (stageState.status === 'pending') {
      logger.error(`阶段 ${currentStage} 尚未启动。请先运行 \`flowcompass run ${currentStage}\`。`);
      return;
    }

    // Guard: refuse if stage is still in_progress (skills not all complete)
    if (stageState.status === 'in_progress') {
      const allSkillsDone = stageState.skills.length === 0 || stageState.skills.every((s) => s.status === 'completed');
      if (!allSkillsDone) {
        logger.error(`阶段 ${currentStage} 尚未完成所有 Skill，不能推进。`);
        return;
      }
      pipeline.complete(currentStage);
    }

    // Check for next stage — use pipeline-next for retrospective loop
    const nextStageName = pipeline.getNextStage(currentStage, cmd['pipeline-next']);
    if (!nextStageName) {
      logger.success('所有阶段已完成！使用 `flowcompass run investigation` 开始新一轮迭代。');
      await manager.save(pipeline.getState());
      return;
    }

    // Guard: next stage already started
    const nextStageState = state.stages[nextStageName];
    if (nextStageState && nextStageState.status !== 'pending') {
      logger.error(`下一阶段 ${nextStageName} 已经启动（状态: ${nextStageState.status}），不能重复推进。`);
      return;
    }

    if (cmd['handoff-policy'] === 'approval-required') {
      logger.warn(`阶段 "${currentStage}" 需要 approval-required 确认。`);
      logger.info('请确认当前阶段产出物无误后再推进。');
    }

    await manager.save(pipeline.getState());
    logger.success(`已完成: ${currentStage}`);

    // Determine the next stage
    let nextStage: StageName = nextStageName;
    let nextCmd = await resolveCommand(nextStage, configDir);

    // If handoff-policy is approval-required, prepare for manual run
    if (nextCmd['handoff-policy'] !== 'auto') {
      const currentState = await manager.load(tool, 'cli');
      const currentPipeline = Pipeline.fromState(currentState);
      currentPipeline.prepareNextStage(nextStage);
      await manager.save(currentPipeline.getState());
      logger.info(`推进到: ${chalk.bold(nextStage)} (需确认，请运行 \`flowcompass run ${nextStage}\`)`);
      return;
    }

    // Auto-advance loop: execute stages iteratively
    let iterations = 0;
    while (iterations < MAX_AUTO_ADVANCE_ITERATIONS) {
      iterations++;
      logger.info(`推进到: ${chalk.bold(nextStage)}`);
      logger.info('auto 模式：自动执行当前阶段...');

      const { SubAgentRunner } = await import('../core/subagent-runner.js');
      const runner = new SubAgentRunner(projectDir, configDir, tool);
      try {
        await runner.execute(nextStage);
      } finally {
        runner.dispose();
      }

      // Check if execution succeeded
      const postExecState = await manager.load(tool, 'cli');
      const postExecStage = postExecState.stages[nextStage];
      if (!postExecStage || postExecStage.status !== 'completed') {
        logger.warn(`阶段 ${nextStage} 未成功完成，停止自动推进。`);
        return;
      }

      // Get next stage — use pipeline-next for retrospective loop
      const nextPipeline = Pipeline.fromState(postExecState);
      const nextCmdDef = await resolveCommand(nextStage, configDir);
      const candidateStage = nextPipeline.getNextStage(nextStage, nextCmdDef['pipeline-next']);
      if (!candidateStage) {
        logger.success('所有阶段已完成！使用 `flowcompass run investigation` 开始新一轮迭代。');
        return;
      }

      const candidateCmd = await resolveCommand(candidateStage, configDir);

      // If next stage requires approval, prepare it and stop
      if (candidateCmd['handoff-policy'] !== 'auto') {
        const setupState = await manager.load(tool, 'cli');
        const setupPipeline = Pipeline.fromState(setupState);
        setupPipeline.prepareNextStage(candidateStage);
        await manager.save(setupPipeline.getState());
        logger.info(`推进到: ${chalk.bold(candidateStage)} (需确认，请运行 \`flowcompass run ${candidateStage}\`)`);
        return;
      }

      // Guard: check candidate not already started
      const candidateState = postExecState.stages[candidateStage];
      if (candidateState && candidateState.status !== 'pending') {
        logger.warn(`阶段 ${candidateStage} 已启动，停止自动推进。`);
        return;
      }

      nextStage = candidateStage;
      nextCmd = candidateCmd;
    }

    logger.warn(`自动推进已达最大迭代次数 (${MAX_AUTO_ADVANCE_ITERATIONS})，请手动运行 \`flowcompass next\` 继续。`);
  } catch (err) {
    logger.error(`推进失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}
