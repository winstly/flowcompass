import { describe, it, expect } from 'vitest';
import { resolveCommand, listCommands } from '../../src/core/command-resolver.js';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('command-resolver', () => {
  it('resolves investigation command', async () => {
    const cmd = await resolveCommand('investigation', CONFIG_DIR);
    expect(cmd.name).toBe('investigation');
    expect(cmd.stage).toBe('立项调研');
    expect(cmd.skills).toEqual(['pm-structural-decomposition']);
    expect(cmd['handoff-policy']).toBe('auto');
    expect(cmd['pipeline-next']).toBe('requirements');
  });

  it('resolves requirements command', async () => {
    const cmd = await resolveCommand('requirements', CONFIG_DIR);
    expect(cmd.name).toBe('requirements');
    expect(cmd.skills).toEqual(['pm-requirements-initial-review', 'pm-requirements-alignment']);
    expect(cmd['handoff-policy']).toBe('approval-required');
  });

  it('resolves architecture command with 3 skills', async () => {
    const cmd = await resolveCommand('architecture', CONFIG_DIR);
    expect(cmd.skills).toEqual([
      'pm-main-agent-selection',
      'pm-subagent-analysis',
      'pm-requirements-consolidation',
    ]);
  });

  it('throws for unknown command', async () => {
    await expect(resolveCommand('nonexistent', CONFIG_DIR)).rejects.toThrow(
      'Command not found: nonexistent',
    );
  });

  it('lists all 8 commands', async () => {
    const commands = await listCommands(CONFIG_DIR);
    expect(commands).toHaveLength(8);
    const names = commands.map((c) => c.name);
    expect(names).toContain('investigation');
    expect(names).toContain('retrospective');
  });

  it('deployment command has empty skills', async () => {
    const cmd = await resolveCommand('deployment', CONFIG_DIR);
    expect(cmd.skills).toEqual([]);
  });
});
