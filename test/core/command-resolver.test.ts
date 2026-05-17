import { describe, it, expect } from 'vitest';
import { resolveCommand, listCommands } from '../../src/core/command-resolver.js';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('command-resolver', () => {
  it('resolves investigation command', () => {
    const cmd = resolveCommand('investigation', CONFIG_DIR);
    expect(cmd.name).toBe('investigation');
    expect(cmd.stage).toBe('立项调研');
    expect(cmd.skills).toEqual(['structural-decomposition']);
    expect(cmd['handoff-policy']).toBe('auto');
    expect(cmd['pipeline-next']).toBe('requirements');
  });

  it('resolves requirements command', () => {
    const cmd = resolveCommand('requirements', CONFIG_DIR);
    expect(cmd.name).toBe('requirements');
    expect(cmd.skills).toEqual(['requirements-initial-review', 'requirements-alignment']);
    expect(cmd['handoff-policy']).toBe('approval-required');
  });

  it('resolves architecture command with 3 skills', () => {
    const cmd = resolveCommand('architecture', CONFIG_DIR);
    expect(cmd.skills).toEqual([
      'roster-management',
      'subagent-analysis',
      'requirements-consolidation',
    ]);
  });

  it('throws for unknown command', () => {
    expect(() => resolveCommand('nonexistent', CONFIG_DIR)).toThrow(
      'Command not found: nonexistent',
    );
  });

  it('lists all 8 commands', () => {
    const commands = listCommands(CONFIG_DIR);
    expect(commands).toHaveLength(8);
    const names = commands.map((c) => c.name);
    expect(names).toContain('investigation');
    expect(names).toContain('retrospective');
  });

  it('deployment command has empty skills', () => {
    const cmd = resolveCommand('deployment', CONFIG_DIR);
    expect(cmd.skills).toEqual([]);
  });
});
