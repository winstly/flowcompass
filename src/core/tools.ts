import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { ToolId, ExecutionMode } from '../types.js';

export interface ToolOption {
  name: string;
  value: ToolId;
  skillsDir: string;
  detectionPaths: string[];
  cliCommand?: string;
  mode: ExecutionMode;
}

export const SUPPORTED_TOOLS: ToolOption[] = [
  {
    name: 'Claude Code',
    value: 'claude',
    skillsDir: '.claude',
    detectionPaths: ['.claude'],
    cliCommand: 'claude',
    mode: 'cli',
  },
  {
    name: 'OpenCode',
    value: 'opencode',
    skillsDir: '.opencode',
    detectionPaths: ['.opencode'],
    cliCommand: 'opencode',
    mode: 'cli',
  },
  {
    name: 'Cursor',
    value: 'cursor',
    skillsDir: '.cursor',
    detectionPaths: ['.cursor', '.cursorrules'],
    mode: 'file-driven',
  },
  {
    name: 'Windsurf',
    value: 'windsurf',
    skillsDir: '.windsurf',
    detectionPaths: ['.windsurf', '.windsurfrules'],
    mode: 'file-driven',
  },
  {
    name: 'Cline',
    value: 'cline',
    skillsDir: '.cline',
    detectionPaths: ['.cline', '.clinerules'],
    mode: 'file-driven',
  },
];

export function detectProjectTools(projectDir: string): ToolOption[] {
  return SUPPORTED_TOOLS.filter((tool) =>
    tool.detectionPaths.some((p) => existsSync(join(projectDir, p))),
  );
}

export function getToolByValue(value: string): ToolOption | undefined {
  return SUPPORTED_TOOLS.find((t) => t.value === value);
}

export function isInteractive(): boolean {
  if (process.env.CI) return false;
  if (process.env.NO_INTERACTIVE === '1') return false;
  if (process.env.STD_WORKFLOW_NO_INTERACTIVE === '1') return false;
  return !!process.stdin.isTTY;
}
