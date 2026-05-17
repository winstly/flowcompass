import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { uninstall } from '../../src/commands/uninstall.js';

describe('uninstall', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'flowcompass-uninstall-test-'));
    // Create .claude directory structure to uninstall
    const claudeDir = join(tempDir, '.claude');
    mkdirSync(join(claudeDir, 'skills'), { recursive: true });
    mkdirSync(join(claudeDir, 'commands'), { recursive: true });
    mkdirSync(join(claudeDir, 'rules'), { recursive: true });
    mkdirSync(join(claudeDir, 'agents'), { recursive: true });
    writeFileSync(join(claudeDir, 'skills', 'test.md'), '');
    writeFileSync(join(claudeDir, 'commands', 'test.md'), '');
    writeFileSync(join(claudeDir, 'rules', 'test.md'), '');
    writeFileSync(join(claudeDir, 'agents', 'test.md'), '');
    // Create .knowledge directory that should be preserved
    mkdirSync(join(tempDir, '.knowledge'), { recursive: true });
    writeFileSync(join(tempDir, '.knowledge', 'test.json'), '{}');
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should remove .claude directories', async () => {
    await uninstall({ projectDir: tempDir, tool: 'claude' });
    const claudeDir = join(tempDir, '.claude');
    expect(existsSync(join(claudeDir, 'skills'))).toBe(false);
    expect(existsSync(join(claudeDir, 'commands'))).toBe(false);
    expect(existsSync(join(claudeDir, 'rules'))).toBe(false);
    expect(existsSync(join(claudeDir, 'agents'))).toBe(false);
  });

  it('should preserve .knowledge directory', async () => {
    await uninstall({ projectDir: tempDir, tool: 'claude' });
    expect(existsSync(join(tempDir, '.knowledge'))).toBe(true);
    expect(existsSync(join(tempDir, '.knowledge', 'test.json'))).toBe(true);
  });

  it('should handle missing directories gracefully', async () => {
    const emptyDir = mkdtempSync(join(tmpdir(), 'flowcompass-empty-'));
    try {
      await expect(uninstall({ projectDir: emptyDir, tool: 'claude' })).resolves.not.toThrow();
    } finally {
      rmSync(emptyDir, { recursive: true, force: true });
    }
  });
});
