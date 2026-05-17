import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join, dirname } from 'node:path';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolveSkill, listSkills } from '../../src/core/skill-resolver.js';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('resolveSkill', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'skill-test-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('resolves a valid skill definition', () => {
    const skill = resolveSkill('structural-decomposition', CONFIG_DIR);
    expect(skill.name).toBe('structural-decomposition');
    expect(skill.level).toBe(1);
    expect(skill.pipeline).toHaveLength(3);
    expect(skill['handoff-policy']).toBe('auto');
    expect(skill.handoff).toBeTruthy();
  });

  it('throws for unknown skill', () => {
    expect(() => resolveSkill('nonexistent-skill', CONFIG_DIR)).toThrow('Skill not found');
  });

  it('validates skill has required fields', () => {
    const skillDir = join(tempDir, 'skills', 'test-skill');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.md'), '---\nname: test-skill\n---\nBody');

    expect(() => resolveSkill('test-skill', tempDir)).toThrow('missing required field');
  });

  it('validates pipeline has 3 elements', () => {
    const skillDir = join(tempDir, 'skills', 'bad-pipe');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.md'), [
      '---',
      'name: bad-pipe',
      'description: test',
      'level: 1',
      'pipeline: [a, b]',
      'handoff-policy: auto',
      'handoff: wiki/test.md',
      '---',
    ].join('\n'));

    expect(() => resolveSkill('bad-pipe', tempDir)).toThrow('pipeline');
  });
});

describe('listSkills', () => {
  it('lists all skills from config directory', () => {
    const skills = listSkills(join(__dirname, '..', '..', 'config'));
    expect(skills.length).toBe(20);
    expect(skills.some((s) => s.name === 'structural-decomposition')).toBe(true);
    expect(skills.some((s) => s.name === 'roster-management')).toBe(true);
    expect(skills.some((s) => s.name === 'org-charter')).toBe(true);
  });
});
