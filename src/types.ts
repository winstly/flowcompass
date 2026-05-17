export interface CommandDefinition {
  name: string;
  stage: string;
  trigger: string;
  level: string;
  model: 'sonnet' | 'opus' | 'haiku';
  'handoff-policy': 'auto' | 'approval-required';
  'pipeline-next': string;
  skills: string[];
  'wiki-category': string;
}

export interface SkillDefinition {
  name: string;
  description: string;
  'argument-hint'?: string;
  level: string;
  pipeline: [string, string, string];
  'handoff-policy': 'auto' | 'approval-required';
  handoff: string;
}

export type StageStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export type SkillStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface SkillExecutionState {
  skill_name: string;
  status: SkillStatus;
  started_at?: string;
  completed_at?: string;
  output_path?: string;
  output_summary?: string;
  error_message?: string;
}

export interface StageExecutionState {
  status: StageStatus;
  started_at?: string;
  completed_at?: string;
  current_skill_index: number;
  skills: SkillExecutionState[];
}

export type ToolId = 'claude' | 'opencode' | 'cursor' | 'windsurf' | 'cline';
export type ExecutionMode = 'cli' | 'file-driven';

export interface PipelineState {
  active: boolean;
  current_command: string | null;
  tool: ToolId;
  mode: ExecutionMode;
  stages: Record<string, StageExecutionState>;
  context: {
    level: string;
    completed_skills: string[];
    last_artifact_path?: string;
    iteration: number;
  };
}

export const STAGE_ORDER = [
  'investigation',
  'requirements',
  'architecture',
  'design',
  'development',
  'testing',
  'deployment',
  'retrospective',
] as const;

export type StageName = (typeof STAGE_ORDER)[number];

export type ToolCommandAdapter = {
  toolId: ToolId;
  getSkillsDir(targetDir: string): string;
  getCommandsDir(targetDir: string): string;
  getRulesDir(targetDir: string): string;
  getAgentsDir(targetDir: string): string;
  getCommandFilePath(commandName: string): string;
  formatCommandFile(definition: CommandDefinition, content: string): string;
};
