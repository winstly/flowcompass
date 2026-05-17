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
  level: string | number;
  pipeline: [string, string, string];
  'handoff-policy': 'auto' | 'approval-required';
  handoff: string;
}

export type ToolId = 'claude' | 'opencode' | 'cursor' | 'windsurf' | 'cline';
export type ExecutionMode = 'cli' | 'file-driven';

export const VALID_MODELS = new Set(['sonnet', 'opus', 'haiku']);
export const VALID_POLICIES = new Set(['auto', 'approval-required']);

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

export type ToolCommandAdapter = {
  toolId: ToolId;
  getSkillsDir(targetDir: string): string;
  getCommandsDir(targetDir: string): string;
  getRulesDir(targetDir: string): string;
  getAgentsDir(targetDir: string): string;
  getCommandFilePath(commandName: string): string;
  formatCommandFile(definition: CommandDefinition, content: string): string;
  skillPrefix: string;
};
