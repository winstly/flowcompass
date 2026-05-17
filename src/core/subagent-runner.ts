import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileExists, writeText, ensureDir } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { validatePathSegment } from '../utils/validation.js';
import type { CommandDefinition, PipelineState, ToolId, SkillDefinition, StageName } from '../types.js';
import { Pipeline, assertStageName } from './pipeline.js';
import { StateManager, KNOWLEDGE_DIR } from './state-manager.js';
import { resolveCommand } from './command-resolver.js';
import { resolveSkill } from './skill-resolver.js';
import { syncWiki } from './wiki-sync.js';
import { resolveStageAgents } from './stage-mapping.js';

const SUBPROCESS_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OUTPUT_BYTES = 10 * 1024 * 1024; // 10 MB

export interface SubAgentResult {
  success: boolean;
  pending?: boolean;
  output?: string;
  error?: string;
  artifactPath?: string;
}

interface SkillRun {
  name: string;
  definition: SkillDefinition;
  result?: SubAgentResult;
}

export class SubAgentRunner {
  private projectDir: string;
  private configDir: string;
  private manager: StateManager;
  private tool: ToolId;
  private activeChild: ReturnType<typeof spawn> | null = null;
  private cleanupFn: (() => void) | null = null;

  constructor(projectDir: string, configDir: string, tool: ToolId, private force: boolean = false) {
    this.projectDir = projectDir;
    this.configDir = configDir;
    this.manager = new StateManager(projectDir);
    this.tool = tool;

    this.cleanupFn = () => { this.killChild(); };
    process.on('SIGINT', this.cleanupFn);
    process.on('SIGTERM', this.cleanupFn);
    process.on('exit', this.cleanupFn);
  }

  dispose(): void {
    if (this.cleanupFn) {
      process.off('SIGINT', this.cleanupFn);
      process.off('SIGTERM', this.cleanupFn);
      process.off('exit', this.cleanupFn);
      this.cleanupFn = null;
    }
    this.killChild();
  }

  private killChild(): void {
    if (this.activeChild && !this.activeChild.killed) {
      this.activeChild.kill('SIGTERM');
      this.activeChild = null;
    }
  }

  async execute(commandName: string): Promise<void> {
    const stage = assertStageName(commandName);
    const cmd = await resolveCommand(commandName, this.configDir);

    // Guard: refuse to re-start an in-progress stage (unless --force)
    const currentState = await this.manager.load(this.tool, 'cli');
    const stageState = currentState.stages[stage];
    if (stageState && stageState.status === 'in_progress') {
      if (!this.force) {
        logger.error(`阶段 ${stage} 正在执行中。如需重新开始，请使用 --force 或 \`flowcompass reset\`。`);
        return;
      }
      logger.warn(`--force: 重新启动阶段 ${stage}`);
    }

    // Guard: refuse to re-run a completed stage (unless --force)
    if (stageState && stageState.status === 'completed' && !this.force) {
      logger.error(`阶段 ${stage} 已完成。如需重新执行，请使用 --force。`);
      return;
    }

    if (cmd.skills.length === 0) {
      logger.warn(`${cmd.stage}阶段暂无 Skill，将自动标记为完成。`);
      const pipeline = Pipeline.fromState(currentState);
      pipeline.start(stage);
      pipeline.complete(stage);
      await this.manager.save(pipeline.getState());
      return;
    }

    const pipeline = Pipeline.fromState(currentState);
    pipeline.start(stage, cmd.skills);
    await this.manager.save(pipeline.getState());

    logger.info(`开始执行阶段: ${cmd.stage} (${commandName})`);
    logger.info(`模型: ${cmd.model} | 级别: ${cmd.level} | 门控: ${cmd['handoff-policy']}`);

    const skillRuns: SkillRun[] = [];
    for (const skillName of cmd.skills) {
      const skillDef = await resolveSkill(skillName, this.configDir);
      skillRuns.push({ name: skillName, definition: skillDef });
    }

    // Execute skills sequentially
    for (let i = 0; i < skillRuns.length; i++) {
      const run = skillRuns[i];
      logger.info(`[${i + 1}/${skillRuns.length}] 执行 Skill: ${run.name}`);

      const beforeState = await this.manager.load(this.tool, 'cli');
      const beforePipeline = Pipeline.fromState(beforeState);
      beforePipeline.startSkill(stage, i);
      await this.manager.save(beforePipeline.getState());

      const result = await this.runSkill(run.name, run.definition, cmd, beforeState);

      const afterState = await this.manager.load(this.tool, 'cli');
      const afterPipeline = Pipeline.fromState(afterState);

      if (result.pending) {
        afterPipeline.completeSkill(stage, i, result.output, result.artifactPath);
        logger.info(`Skill ${run.name} 等待手动完成。完成后运行 \`flowcompass next\` 推进。`);
        await this.manager.save(afterPipeline.getState());
        return;
      }

      if (result.success) {
        const handoffPath = this.resolveHandoffPath(run.definition.handoff);
        const handoffExists = handoffPath ? fileExists(handoffPath) : false;
        const artifactPath = handoffExists ? handoffPath : result.artifactPath;

        afterPipeline.completeSkill(stage, i, result.output, artifactPath);

        if (!handoffExists) {
          this.syncSkillOutput(run.name, run.definition, cmd, result.output ?? '');
        } else {
          logger.verbose(`Skill ${run.name} 已写入 handoff: ${handoffPath}`);
        }

        logger.success(`Skill ${run.name} 完成`);
      } else {
        afterPipeline.failSkill(stage, i, result.error ?? 'Unknown error');
        afterPipeline.failStage(stage, result.error ?? 'Unknown error');
        logger.error(`Skill ${run.name} 失败: ${result.error}`);
        await this.manager.save(afterPipeline.getState());
        return;
      }

      await this.manager.save(afterPipeline.getState());
      run.result = result;
    }

    const finalState = await this.manager.load(this.tool, 'cli');
    const finalPipeline = Pipeline.fromState(finalState);
    finalPipeline.complete(stage);
    await this.manager.save(finalPipeline.getState());

    logger.success(`阶段 ${cmd.stage} 全部完成`);
  }

  private resolveHandoffPath(handoff: string): string | undefined {
    if (!handoff) return undefined;
    validatePathSegment(handoff.replace(/^[^/]*\/[^/]*\//, ''), 'handoff path segment');
    return join(this.projectDir, KNOWLEDGE_DIR, handoff);
  }

  private async runSkill(
    skillName: string,
    skillDef: SkillDefinition,
    cmd: CommandDefinition,
    state: PipelineState,
  ): Promise<SubAgentResult> {
    const prompt = this.buildPrompt(skillName, skillDef, cmd, state);

    if (this.tool === 'claude') {
      return this.runClaude(prompt);
    } else if (this.tool === 'opencode') {
      return this.runOpenCode(prompt);
    } else {
      return this.runFileDriven(skillName, skillDef, prompt);
    }
  }

  private buildPrompt(
    skillName: string,
    skillDef: SkillDefinition,
    cmd: CommandDefinition,
    state: PipelineState,
  ): string {
    const contextSkills = state.context.completed_skills.join(', ') || 'none';
    const stage = assertStageName(cmd.name);

    const agentSection = this.buildAgentSection(stage);

    return [
      `You are executing skill "${skillName}" in stage "${cmd.stage}" of the flowcompass pipeline.`,
      agentSection,
      `Level: ${cmd.level} | Model: ${cmd.model}`,
      `Previously completed skills: ${contextSkills}`,
      `Last artifact: ${state.context.last_artifact_path ?? 'none'}`,
      '',
      `Skill description: ${skillDef.description}`,
      skillDef['argument-hint'] ? `Argument hint: ${skillDef['argument-hint']}` : '',
      `Handoff: ${skillDef.handoff}`,
      '',
      'Execute this skill now. Write all outputs to the specified handoff path under .knowledge/wiki/summaries/.',
    ].filter(Boolean).join('\n');
  }

  private buildAgentSection(stage: StageName): string {
    try {
      const agents = resolveStageAgents(stage, this.configDir);
      if (agents.length === 0) return '';
      const lines = ['\nYour active roles for this stage:'];
      for (const agent of agents) {
        lines.push(`--- ${agent.name} ---`);
        lines.push(agent.summary);
        lines.push('');
      }
      return lines.join('\n');
    } catch (err) {
      logger.verbose(`Could not load agents for stage ${stage}: ${err instanceof Error ? err.message : String(err)}`);
      return '';
    }
  }

  private spawnWithTimeout(
    command: string,
    args: string[],
  ): Promise<SubAgentResult> {
    return new Promise((resolve) => {
      const child = spawn(command, args, { cwd: this.projectDir });
      this.activeChild = child;

      let stdout = '';
      let stderr = '';
      let settled = false;

      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          child.kill('SIGTERM');
          resolve({ success: false, error: `Process timed out after ${SUBPROCESS_TIMEOUT_MS / 1000}s` });
        }
      }, SUBPROCESS_TIMEOUT_MS);

      child.stdout?.on('data', (d: Buffer) => {
        stdout += d.toString();
        if (stdout.length > MAX_OUTPUT_BYTES) {
          if (!settled) {
            settled = true;
            child.kill('SIGTERM');
            resolve({ success: false, error: `Output exceeded ${MAX_OUTPUT_BYTES / 1024 / 1024}MB limit` });
          }
        }
      });
      child.stderr?.on('data', (d: Buffer) => {
        stderr += d.toString();
        if (stderr.length > MAX_OUTPUT_BYTES) {
          if (!settled) {
            settled = true;
            child.kill('SIGTERM');
            resolve({ success: false, error: `Stderr exceeded ${MAX_OUTPUT_BYTES / 1024 / 1024}MB limit` });
          }
        }
      });

      child.on('close', (code) => {
        clearTimeout(timer);
        this.activeChild = null;
        if (settled) return;
        settled = true;
        if (code === 0) {
          resolve({ success: true, output: stdout.trim() });
        } else {
          resolve({ success: false, error: stderr.trim() || `Exit code ${code}` });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timer);
        this.activeChild = null;
        if (settled) return;
        settled = true;
        const msg = err.message;
        if (msg.includes('ENOENT')) {
          resolve({ success: false, error: `${command} CLI 未安装。请先安装 ${command} 命令行工具。` });
        } else {
          resolve({ success: false, error: msg });
        }
      });
    });
  }

  private runClaude(prompt: string): Promise<SubAgentResult> {
    return this.spawnWithTimeout('claude', ['-p', prompt, '--output-format', 'text']);
  }

  private runOpenCode(prompt: string): Promise<SubAgentResult> {
    return this.spawnWithTimeout('opencode', ['run', prompt]);
  }

  private syncSkillOutput(
    skillName: string,
    skillDef: SkillDefinition,
    cmd: CommandDefinition,
    output: string,
  ): void {
    try {
      const category = cmd['wiki-category'] || 'execution';
      const filename = skillDef.handoff.split('/').pop() || `${skillName}.md`;
      syncWiki({
        projectDir: this.projectDir,
        category,
        filename,
        content: output,
        skillName,
        level: cmd.level,
      });
    } catch (err) {
      logger.warn(`Wiki sync failed for ${skillName}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  private async runFileDriven(
    skillName: string,
    _skillDef: SkillDefinition,
    prompt: string,
  ): Promise<SubAgentResult> {
    const taskDir = join(this.projectDir, KNOWLEDGE_DIR, 'tasks');
    ensureDir(taskDir);

    const taskFile = join(taskDir, `${skillName}.md`);
    writeText(taskFile, [
      `# Task: ${skillName}`,
      '',
      prompt,
      '',
      `Status: pending`,
      `Created: ${new Date().toISOString()}`,
      '',
      '将 Status 改为 completed 后运行 `flowcompass next` 推进流水线。',
    ].join('\n'));

    logger.info(`Task file written to ${taskFile}`);
    logger.warn('File-driven 模式: 请手动执行任务后将 Status 改为 completed，再运行 `flowcompass next`');
    return { success: true, pending: true, output: `Task file created at ${taskFile}. Awaiting manual completion.` };
  }
}
