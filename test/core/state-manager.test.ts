import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { StateManager, KNOWLEDGE_DIR } from '../../src/core/state-manager.js';
import { Pipeline } from '../../src/core/pipeline.js';

describe('StateManager', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'flowcompass-test-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('loads default state when no state file exists', async () => {
    const manager = new StateManager(tempDir);
    const state = await manager.load();
    expect(state.active).toBe(false);
    expect(state.current_command).toBeNull();
    expect(state.tool).toBe('claude');
    expect(state.mode).toBe('cli');
  });

  it('saves and loads state', async () => {
    const manager = new StateManager(tempDir);
    const pipeline = Pipeline.create();
    pipeline.start('investigation');
    await manager.save(pipeline.getState());

    const loaded = await manager.load();
    expect(loaded.active).toBe(true);
    expect(loaded.current_command).toBe('investigation');
    expect(loaded.stages.investigation.status).toBe('in_progress');
  });

  it('resets state to initial', async () => {
    const manager = new StateManager(tempDir);
    const pipeline = Pipeline.create();
    pipeline.start('investigation');
    await manager.save(pipeline.getState());

    await manager.reset();
    const loaded = await manager.load();
    expect(loaded.active).toBe(false);
    expect(loaded.current_command).toBeNull();
  });

  it('recovers from corrupted JSON', async () => {
    const manager = new StateManager(tempDir);
    const knowledgeDir = join(tempDir, KNOWLEDGE_DIR);
    mkdirSync(knowledgeDir, { recursive: true });
    writeFileSync(join(knowledgeDir, 'state.json'), '{ invalid json');

    const state = await manager.load();
    expect(state.active).toBe(false);
    expect(state.tool).toBe('claude');
  });

  it('recovers from state missing tool/mode/context fields by filling defaults', async () => {
    const manager = new StateManager(tempDir);
    const knowledgeDir = join(tempDir, KNOWLEDGE_DIR);
    mkdirSync(knowledgeDir, { recursive: true });
    writeFileSync(join(knowledgeDir, 'state.json'), JSON.stringify({
      active: true,
      current_command: 'requirements',
      stages: {
        investigation: { status: 'completed', current_skill_index: -1, skills: [] },
        requirements: { status: 'in_progress', current_skill_index: 0, skills: [] },
      },
    }));

    const state = await manager.load('claude', 'cli');
    // Should fill missing fields instead of resetting
    expect(state.active).toBe(true);
    expect(state.current_command).toBe('requirements');
    expect(state.tool).toBe('claude');
    expect(state.mode).toBe('cli');
    expect(state.stages.investigation.status).toBe('completed');
    // Missing stages should be created
    expect(state.stages.requirements).toBeDefined();
  });

  it('preserves tool/mode from load parameters', async () => {
    const manager = new StateManager(tempDir);
    const state = await manager.load('opencode', 'cli');
    expect(state.tool).toBe('opencode');
  });

  it('reset accepts tool and mode parameters', async () => {
    const manager = new StateManager(tempDir);
    await manager.reset('cursor', 'file-driven');
    const state = await manager.load();
    expect(state.tool).toBe('cursor');
    expect(state.mode).toBe('file-driven');
  });
});
