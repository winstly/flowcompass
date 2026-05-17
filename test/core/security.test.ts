import { describe, it, expect } from 'vitest';
import { resolveCommand } from '../../src/core/command-resolver.js';
import { resolveSkill } from '../../src/core/skill-resolver.js';
import { Pipeline } from '../../src/core/pipeline.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('path traversal protection', () => {
  it('rejects command name with ..', async () => {
    await expect(resolveCommand('..', CONFIG_DIR)).rejects.toThrow();
  });

  it('rejects command name with /', async () => {
    await expect(resolveCommand('foo/bar', CONFIG_DIR)).rejects.toThrow();
  });

  it('rejects command name with \\', async () => {
    await expect(resolveCommand('foo\\bar', CONFIG_DIR)).rejects.toThrow();
  });

  it('rejects skill name with ..', async () => {
    await expect(resolveSkill('..', CONFIG_DIR)).rejects.toThrow();
  });

  it('rejects skill name with /', async () => {
    await expect(resolveSkill('foo/bar', CONFIG_DIR)).rejects.toThrow();
  });

  it('rejects uppercase command name (allowlist)', async () => {
    await expect(resolveCommand('FOO', CONFIG_DIR)).rejects.toThrow();
  });

  it('rejects command name with spaces', async () => {
    await expect(resolveCommand('foo bar', CONFIG_DIR)).rejects.toThrow();
  });
});

describe('iteration counter', () => {
  it('only increments on investigation start', () => {
    const pipeline = Pipeline.create();
    expect(pipeline.getState().context.iteration).toBe(0);

    pipeline.start('investigation');
    expect(pipeline.getState().context.iteration).toBe(1);

    pipeline.complete('investigation');
    pipeline.start('requirements');
    expect(pipeline.getState().context.iteration).toBe(1);
  });

  it('prunes completed_skills at cycle boundary', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    pipeline.startSkill('investigation', 0);
    pipeline.completeSkill('investigation', 0, 'done');
    expect(pipeline.getState().context.completed_skills).toContain('skill-a');

    pipeline.complete('investigation');
    pipeline.start('investigation', ['skill-b']);
    expect(pipeline.getState().context.completed_skills).toEqual([]);
    expect(pipeline.getState().context.iteration).toBe(2);
  });
});

describe('getNextStage', () => {
  it('returns next stage for non-final stages', () => {
    const pipeline = Pipeline.create();
    expect(pipeline.getNextStage('investigation')).toBe('requirements');
    expect(pipeline.getNextStage('requirements')).toBe('architecture');
    expect(pipeline.getNextStage('testing')).toBe('deployment');
  });

  it('returns undefined for retrospective without pipeline-next', () => {
    const pipeline = Pipeline.create();
    expect(pipeline.getNextStage('retrospective')).toBeUndefined();
  });

  it('returns pipeline-next for retrospective when provided', () => {
    const pipeline = Pipeline.create();
    expect(pipeline.getNextStage('retrospective', 'investigation')).toBe('investigation');
  });

  it('ignores invalid pipeline-next', () => {
    const pipeline = Pipeline.create();
    expect(pipeline.getNextStage('retrospective', 'invalid-stage')).toBeUndefined();
  });
});

describe('failSkill validation', () => {
  it('rejects failing a non-in_progress skill', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    // skill-a is still 'pending' (startSkill not called)
    expect(() => pipeline.failSkill('investigation', 0, 'err')).toThrow('expected "in_progress"');
  });

  it('allows failing an in_progress skill', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    pipeline.startSkill('investigation', 0);
    expect(() => pipeline.failSkill('investigation', 0, 'err')).not.toThrow();
  });
});

describe('completed_skills deduplication', () => {
  it('does not add duplicate skill names', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    pipeline.startSkill('investigation', 0);
    pipeline.completeSkill('investigation', 0, 'done');
    expect(pipeline.getState().context.completed_skills).toEqual(['skill-a']);
  });
});
