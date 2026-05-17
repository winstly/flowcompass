import { join } from 'node:path';
import { readText } from '../utils/fs.js';
import { validateName, stripCrlf, validatePathSegment } from '../utils/validation.js';
import YAML from 'yaml';
import type { SkillDefinition } from '../types.js';

const VALID_POLICIES = new Set(['auto', 'approval-required']);

export async function resolveSkill(
  name: string,
  configDir: string,
): Promise<SkillDefinition> {
  validateName(name);
  const skillDir = join(configDir, 'skills', name);
  const skillFile = join(skillDir, 'SKILL.md');
  let content: string;
  try {
    content = readText(skillFile);
  } catch (err) {
    throw new Error(`Skill not found: ${name}`, { cause: err });
  }
  return parseSkillFrontmatter(content, name);
}

function parseSkillFrontmatter(content: string, name: string): SkillDefinition {
  const normalized = stripCrlf(content);
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`No frontmatter found in skill: ${name}`);
  }
  const parsed = YAML.parse(match[1], { maxAliasCount: 10 }) as Record<string, unknown>;
  const required = ['name', 'description', 'level', 'pipeline', 'handoff-policy', 'handoff'];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`Skill "${name}" missing required field: ${field}`);
    }
  }
  if (!Array.isArray(parsed.pipeline) || parsed.pipeline.length !== 3) {
    throw new Error(`Skill "${name}" field "pipeline" must be an array of 3 elements`);
  }
  if (!parsed.handoff || typeof parsed.handoff !== 'string' || parsed.handoff.trim() === '') {
    throw new Error(`Skill "${name}" field "handoff" must be a non-empty string`);
  }
  if (typeof parsed['handoff-policy'] === 'string' && !VALID_POLICIES.has(parsed['handoff-policy'])) {
    throw new Error(`Skill "${name}" invalid handoff-policy: "${parsed['handoff-policy']}". Must be one of: ${[...VALID_POLICIES].join(', ')}`);
  }
  // Validate handoff path doesn't contain traversal
  const handoffSegments = parsed.handoff.split('/');
  for (const seg of handoffSegments) {
    if (seg.includes('..') || seg.includes('\0')) {
      throw new Error(`Skill "${name}" invalid handoff path: path traversal detected`);
    }
  }
  return parsed as unknown as SkillDefinition;
}
