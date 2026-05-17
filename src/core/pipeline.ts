import { STAGE_ORDER, type PipelineState, type StageName, type StageExecutionState, type SkillExecutionState, type ToolId, type ExecutionMode } from '../types.js';

export function assertStageName(name: string): StageName {
  if (!(STAGE_ORDER as readonly string[]).includes(name)) {
    throw new Error(`Invalid stage name: "${name}". Must be one of: ${STAGE_ORDER.join(', ')}`);
  }
  return name as StageName;
}

function createSkillStates(skillNames: string[]): SkillExecutionState[] {
  return skillNames.map((name) => ({
    skill_name: name,
    status: 'pending' as const,
  }));
}

function createStageState(skills: string[] = []): StageExecutionState {
  return {
    status: 'pending',
    current_skill_index: -1,
    skills: createSkillStates(skills),
  };
}

export class Pipeline {
  private state: PipelineState;

  private constructor(state: PipelineState) {
    this.state = state;
  }

  static create(tool: ToolId = 'claude', mode: ExecutionMode = 'cli'): Pipeline {
    const stages: Record<string, StageExecutionState> = {};
    for (const stage of STAGE_ORDER) {
      stages[stage] = createStageState();
    }
    return new Pipeline({
      active: false,
      current_command: null,
      tool,
      mode,
      stages,
      context: {
        level: '',
        completed_skills: [],
        iteration: 0,
      },
    });
  }

  static fromState(state: PipelineState): Pipeline {
    return new Pipeline(structuredClone(state));
  }

  getState(): PipelineState {
    return structuredClone(this.state);
  }

  /** Set current_command to the next stage without starting it. Used by `next` for approval-required stages. */
  prepareNextStage(stage: StageName) {
    this.state.active = true;
    this.state.current_command = stage;
  }

  start(stage: StageName, skillNames: string[] = []) {
    // Only increment iteration when starting investigation (new cycle)
    if (stage === 'investigation') {
      this.state.context.iteration++;
      // Prune completed_skills at cycle boundary
      this.state.context.completed_skills = [];
      this.state.context.last_artifact_path = undefined;
    }
    this.state.active = true;
    this.state.current_command = stage;
    this.state.stages[stage] = {
      status: 'in_progress',
      started_at: new Date().toISOString(),
      current_skill_index: skillNames.length > 0 ? 0 : -1,
      skills: createSkillStates(skillNames),
    };
  }

  startSkill(stage: StageName, skillIndex: number) {
    const stageState = this.state.stages[stage];
    if (!stageState || stageState.status !== 'in_progress') {
      throw new Error(`Cannot start skill: stage "${stage}" is not in progress`);
    }
    if (skillIndex < 0 || skillIndex >= stageState.skills.length) {
      throw new Error(`Skill index ${skillIndex} out of range for stage "${stage}"`);
    }
    stageState.current_skill_index = skillIndex;
    stageState.skills[skillIndex].status = 'in_progress';
    stageState.skills[skillIndex].started_at = new Date().toISOString();
  }

  completeSkill(stage: StageName, skillIndex: number, summary?: string, outputPath?: string) {
    const stageState = this.state.stages[stage];
    if (!stageState) throw new Error(`Stage "${stage}" not found`);
    const skill = stageState.skills[skillIndex];
    if (!skill || skill.status !== 'in_progress') {
      throw new Error(`Cannot complete skill at index ${skillIndex}: not in progress`);
    }
    skill.status = 'completed';
    skill.completed_at = new Date().toISOString();
    if (summary) skill.output_summary = summary;
    if (outputPath) skill.output_path = outputPath;
    if (!this.state.context.completed_skills.includes(skill.skill_name)) {
      this.state.context.completed_skills.push(skill.skill_name);
    }
    this.state.context.last_artifact_path = outputPath;
  }

  failSkill(stage: StageName, skillIndex: number, error: string) {
    const stageState = this.state.stages[stage];
    if (!stageState) throw new Error(`Stage "${stage}" not found`);
    const skill = stageState.skills[skillIndex];
    if (!skill) throw new Error(`Skill index ${skillIndex} not found in stage "${stage}"`);
    if (skill.status !== 'in_progress') {
      throw new Error(`Cannot fail skill at index ${skillIndex}: status is "${skill.status}", expected "in_progress"`);
    }
    skill.status = 'failed';
    skill.error_message = error;
    skill.completed_at = new Date().toISOString();
  }

  failStage(stage: StageName, error: string) {
    const stageState = this.state.stages[stage];
    if (!stageState) throw new Error(`Stage "${stage}" not found`);
    stageState.status = 'failed';
    stageState.completed_at = new Date().toISOString();
  }

  complete(stage: StageName) {
    const current = this.state.stages[stage];
    if (!current) throw new Error(`Stage "${stage}" not found`);
    if (current.status !== 'in_progress') {
      throw new Error(`Cannot complete stage "${stage}": status is "${current.status}", expected "in_progress"`);
    }
    this.state.stages[stage] = {
      ...current,
      status: 'completed',
      completed_at: new Date().toISOString(),
    };
  }

  getNextStage(currentStage: StageName, pipelineNext?: string): StageName | undefined {
    const idx = STAGE_ORDER.indexOf(currentStage);
    // Last stage: use pipeline-next for iterative loop (e.g. retrospective → investigation)
    if (idx === STAGE_ORDER.length - 1) {
      if (pipelineNext) {
        try {
          return assertStageName(pipelineNext);
        } catch {
          return undefined;
        }
      }
      return undefined;
    }
    return STAGE_ORDER[idx + 1];
  }

  getCurrentSkill(stage: StageName): SkillExecutionState | undefined {
    const stageState = this.state.stages[stage];
    if (!stageState || stageState.current_skill_index < 0) return undefined;
    return stageState.skills[stageState.current_skill_index];
  }

  static getStageOrder(): readonly StageName[] {
    return STAGE_ORDER;
  }
}
