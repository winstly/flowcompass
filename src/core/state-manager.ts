import { join, dirname, resolve } from 'node:path';
import { readFileSync, writeFileSync, renameSync, existsSync, mkdirSync } from 'node:fs';
import { ensureDir } from '../utils/fs.js';
import type { PipelineState, ToolId, ExecutionMode, StageExecutionState } from '../types.js';
import { Pipeline } from './pipeline.js';
import { logger } from '../utils/logger.js';
import { STAGE_ORDER } from '../types.js';

export const KNOWLEDGE_DIR = '.knowledge';
const STATE_FILE = 'state.json';

function createDefaultStage(): StageExecutionState {
  return { status: 'pending', current_skill_index: -1, skills: [] };
}

export class StateManager {
  private statePath: string;

  constructor(projectDir: string) {
    this.statePath = join(projectDir, KNOWLEDGE_DIR, STATE_FILE);
  }

  async load(tool?: ToolId, mode?: ExecutionMode): Promise<PipelineState> {
    if (!existsSync(this.statePath)) {
      return Pipeline.create(tool ?? 'claude', mode ?? 'cli').getState();
    }
    try {
      const content = readFileSync(this.statePath, 'utf-8');
      const state = JSON.parse(content) as PipelineState;

      // Resilient: fill in missing fields instead of resetting everything
      if (!state.tool) state.tool = tool ?? 'claude';
      if (!state.mode) state.mode = mode ?? 'cli';
      if (!state.context) {
        state.context = { level: '', completed_skills: [], iteration: 0 };
      }
      // Ensure all stages exist
      for (const stage of STAGE_ORDER) {
        if (!state.stages[stage]) {
          state.stages[stage] = createDefaultStage();
        }
      }

      return state;
    } catch (err) {
      logger.warn(`state.json corrupted, resetting: ${err instanceof Error ? err.message : String(err)}`);
      return Pipeline.create(tool ?? 'claude', mode ?? 'cli').getState();
    }
  }

  async save(state: PipelineState): Promise<void> {
    ensureDir(dirname(this.statePath));
    const tmpPath = this.statePath + '.tmp';
    writeFileSync(tmpPath, JSON.stringify(state, null, 2), 'utf-8');
    try {
      renameSync(tmpPath, this.statePath);
    } catch {
      // Fallback for cross-device rename issues
      writeFileSync(this.statePath, JSON.stringify(state, null, 2), 'utf-8');
    }
  }

  async reset(tool?: ToolId, mode?: ExecutionMode): Promise<void> {
    const initialState = Pipeline.create(tool ?? 'claude', mode ?? 'cli').getState();
    await this.save(initialState);
  }
}
