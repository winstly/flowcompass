import { join } from 'node:path';
import fg from 'fast-glob';
import { readText } from '../utils/fs.js';
import { validateName, stripCrlf, getStageOrderIndex } from '../utils/validation.js';
import YAML from 'yaml';
import type { CommandDefinition } from '../types.js';

const VALID_MODELS = new Set(['sonnet', 'opus', 'haiku']);
const VALID_POLICIES = new Set(['auto', 'approval-required']);

export async function resolveCommand(
  name: string,
  configDir: string,
): Promise<CommandDefinition> {
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

export async function listCommands(configDir: string): Promise<CommandDefinition[]> {
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
  const normalized = stripCrlf(content);
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`No frontmatter found in command: ${name}`);
  }
  const parsed = YAML.parse(match[1], { maxAliasCount: 10 }) as Record<string, unknown>;
  const required = ['name', 'stage', 'trigger', 'level', 'model', 'handoff-policy', 'pipeline-next', 'skills', 'wiki-category'];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Command "${name}" missing required field: ${field}`);
    }
  }
  if (!Array.isArray(parsed.skills)) {
    throw new Error(`Command "${name}" field "skills" must be an array`);
  }
  if (typeof parsed.model === 'string' && !VALID_MODELS.has(parsed.model)) {
    throw new Error(`Command "${name}" invalid model: "${parsed.model}". Must be one of: ${[...VALID_MODELS].join(', ')}`);
  }
  if (typeof parsed['handoff-policy'] === 'string' && !VALID_POLICIES.has(parsed['handoff-policy'])) {
    throw new Error(`Command "${name}" invalid handoff-policy: "${parsed['handoff-policy']}". Must be one of: ${[...VALID_POLICIES].join(', ')}`);
  }
  return parsed as unknown as CommandDefinition;
}
