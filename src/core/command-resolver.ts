import { join } from 'node:path';
import fg from 'fast-glob';
import { readText } from '../utils/fs.js';
import { validateName, getStageOrderIndex } from '../utils/validation.js';
import { parseFrontmatter, requireFields } from '../utils/frontmatter.js';
import type { CommandDefinition } from '../types.js';
import { VALID_MODELS, VALID_POLICIES } from '../types.js';

export function resolveCommand(
  name: string,
  configDir: string,
): CommandDefinition {
  validateName(name);
  const filePath = join(configDir, 'commands', `${name}.md`);
  let content: string;
  try {
    content = readText(filePath);
  } catch (err) {
    throw new Error(`Command not found: ${name}`, { cause: err });
  }
  return parseCommandFrontmatter(content, name);
}

export function listCommands(configDir: string): CommandDefinition[] {
  const commandsDir = join(configDir, 'commands');
  const files = fg.sync('*.md', { cwd: commandsDir });
  const commands: CommandDefinition[] = [];
  for (const file of files) {
    const content = readText(join(commandsDir, file));
    const name = file.replace(/\.md$/, '');
    commands.push(parseCommandFrontmatter(content, name));
  }
  return commands.sort((a, b) => getStageOrderIndex(a.name) - getStageOrderIndex(b.name));
}

function parseCommandFrontmatter(content: string, name: string): CommandDefinition {
  const parsed = parseFrontmatter(content, `command: ${name}`);
  const required = ['name', 'stage', 'trigger', 'level', 'model', 'handoff-policy', 'pipeline-next', 'skills', 'wiki-category'];
  requireFields(parsed, required, `command: ${name}`);
  if (!Array.isArray(parsed.skills)) {
    throw new Error(`Command "${name}" field "skills" must be an array`);
  }
  if (typeof parsed.model === 'string' && !VALID_MODELS.has(parsed.model)) {
    throw new Error(`Command "${name}" invalid model: "${parsed.model}". Must be one of: ${[...VALID_MODELS].join(', ')}`);
  }
  if (typeof parsed['handoff-policy'] === 'string' && !VALID_POLICIES.has(parsed['handoff-policy'])) {
    throw new Error(`Command "${name}" invalid handoff-policy: "${parsed['handoff-policy']}". Must be one of: ${[...VALID_POLICIES].join(', ')}`);
  }
  const cmd: CommandDefinition = {
    name: parsed.name as string,
    stage: parsed.stage as string,
    trigger: parsed.trigger as string,
    level: parsed.level as string,
    model: parsed.model as CommandDefinition['model'],
    'handoff-policy': parsed['handoff-policy'] as CommandDefinition['handoff-policy'],
    'pipeline-next': parsed['pipeline-next'] as string,
    skills: parsed.skills as string[],
    'wiki-category': parsed['wiki-category'] as string,
  };
  return cmd;
}
