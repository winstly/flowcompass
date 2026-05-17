import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolveSkill } from '../../src/core/skill-resolver.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('resolveSkill', () => {
  it('resolves a valid skill definition', async () => {
    const skill = await resolveSkill('pm-structural-decomposition', CONFIG_DIR);
    expect(skill.name).toBe('pm-structural-decomposition');
    expect(skill.level).toBe(1);
    expect(skill.pipeline).toHaveLength(3);
    expect(skill['handoff-policy']).toBe('auto');
    expect(skill.handoff).toBeTruthy();
  });

  it('throws for unknown skill', async () => {
    await expect(resolveSkill('nonexistent-skill', CONFIG_DIR)).rejects.toThrow('Skill not found');
  });

  it('validates skill has required fields', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'skill-test-'));
    const skillDir = join(tempDir, 'skills', 'test-skill');
    const { mkdirSync } = await import('node:fs');
    mkdirSync(skillDir, { recursive: true });
    writeFileSync(join(skillDir, 'SKILL.md'), '---\nname: test-skill\n---\nBody');

    await expect(resolveSkill('test-skill', tempDir)).rejects.toThrow('missing required field');
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('validates pipeline has 3 elements', async () => {
    const tempDir = mkdtempSync(join(tmpdir(), 'skill-pipe-'));
    const skillDir = join(tempDir, 'skills', 'bad-pipe');
    const { mkdirSync } = await import('node:fs');
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

    await expect(resolveSkill('bad-pipe', tempDir)).rejects.toThrow('pipeline');
    rmSync(tempDir, { recursive: true, force: true });
  });
});
