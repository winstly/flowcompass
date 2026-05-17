import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { status } from '../../src/commands/status.js';

describe('status', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'flowcompass-status-test-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('should handle no detected tools gracefully', () => {
    // Empty directory with no .claude or other tool directories
    expect(() => status(tempDir)).not.toThrow();
  });

  it('should detect installed Claude Code', () => {
    // Create .claude directory structure
    const claudeDir = join(tempDir, '.claude');
    mkdirSync(join(claudeDir, 'skills'), { recursive: true });
    mkdirSync(join(claudeDir, 'commands'), { recursive: true });
    mkdirSync(join(claudeDir, 'rules'), { recursive: true });
    mkdirSync(join(claudeDir, 'agents'), { recursive: true });
    expect(() => status(tempDir)).not.toThrow();
  });

  it('should handle partial installation', () => {
    // Only skills directory exists
    const claudeDir = join(tempDir, '.claude');
    mkdirSync(join(claudeDir, 'skills'), { recursive: true });
    expect(() => status(tempDir)).not.toThrow();
  });
});
