import { join } from 'node:path';
import fg from 'fast-glob';
import { readText } from '../utils/fs.js';
import { validateName, validatePathSegment } from '../utils/validation.js';
import { parseFrontmatter, requireFields } from '../utils/frontmatter.js';
import type { SkillDefinition } from '../types.js';
import { VALID_POLICIES } from '../types.js';

export function resolveSkill(
  name: string,
  configDir: string,
): SkillDefinition {
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

export function listSkills(configDir: string): SkillDefinition[] {
  const skillsDir = join(configDir, 'skills');
  const dirs = fg.sync('*/SKILL.md', { cwd: skillsDir });
  return dirs.map((dir) => {
    const name = dir.replace(/\/SKILL\.md$/, '');
    const content = readText(join(skillsDir, dir));
    return parseSkillFrontmatter(content, name);
  });
}

function parseSkillFrontmatter(content: string, name: string): SkillDefinition {
  const parsed = parseFrontmatter(content, `skill: ${name}`);
  const required = ['name', 'description', 'level', 'pipeline', 'handoff-policy', 'handoff'];
  requireFields(parsed, required, `skill: ${name}`);
  if (!Array.isArray(parsed.pipeline) || parsed.pipeline.length !== 3) {
    throw new Error(`Skill "${name}" field "pipeline" must be an array of 3 elements, got: ${JSON.stringify(parsed.pipeline)}`);
  }
  if (!parsed.handoff || typeof parsed.handoff !== 'string' || parsed.handoff.trim() === '') {
    throw new Error(`Skill "${name}" field "handoff" must be a non-empty string`);
  }
  if (typeof parsed['handoff-policy'] === 'string' && !VALID_POLICIES.has(parsed['handoff-policy'])) {
    throw new Error(`Skill "${name}" invalid handoff-policy: "${parsed['handoff-policy']}". Must be one of: ${[...VALID_POLICIES].join(', ')}`);
  }
  // Validate handoff path doesn't contain traversal
  const handoffSegments = (parsed.handoff as string).split('/');
  for (const seg of handoffSegments) {
    validatePathSegment(seg, `skill "${name}" handoff path segment`);
  }
  const skill: SkillDefinition = {
    name: parsed.name as string,
    description: parsed.description as string,
    'argument-hint': parsed['argument-hint'] as string | undefined,
    level: parsed.level as string | number,
    pipeline: parsed.pipeline as [string, string, string],
    'handoff-policy': parsed['handoff-policy'] as SkillDefinition['handoff-policy'],
    handoff: parsed.handoff as string,
  };
  return skill;
}
