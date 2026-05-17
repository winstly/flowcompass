import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { getAdapter, CommandAdapterRegistry } from '../../src/core/adapters.js';
import type { CommandDefinition } from '../../src/types.js';

const sampleCommand: CommandDefinition = {
  name: 'requirements',
  stage: '需求分析',
  trigger: '/flowcompass:requirements',
  level: '1',
  model: 'sonnet',
  'handoff-policy': 'approval-required',
  'pipeline-next': 'architecture',
  skills: ['pm-requirements-initial-review', 'pm-requirements-alignment'],
  'wiki-category': 'requirements',
};

const toolIds = ['claude', 'opencode', 'cursor', 'windsurf', 'cline'] as const;

describe('all adapters', () => {
  for (const toolId of toolIds) {
    describe(`${toolId} adapter`, () => {
      it('returns non-empty directory paths', () => {
        const adapter = getAdapter(toolId);
        expect(adapter.getSkillsDir('/project')).toBeTruthy();
        expect(adapter.getCommandsDir('/project')).toBeTruthy();
        expect(adapter.getRulesDir('/project')).toBeTruthy();
        expect(adapter.getAgentsDir('/project')).toBeTruthy();
      });

      it('formats command file', () => {
        const adapter = getAdapter(toolId);
        const result = adapter.formatCommandFile(sampleCommand, 'body');
        expect(result).toBeTruthy();
        expect(result).toContain('requirements');
      });

      it('returns command file path', () => {
        const adapter = getAdapter(toolId);
        const path = adapter.getCommandFilePath('requirements');
        expect(path).toContain('requirements');
      });
    });
  }

  it('throws for unknown toolId', () => {
    expect(() => getAdapter('unknown')).toThrow('Unsupported tool');
  });
});

describe('claude adapter specifics', () => {
  it('returns correct directories with path.join', () => {
    const adapter = getAdapter('claude');
    expect(adapter.getSkillsDir('/project')).toBe(join('/project', '.claude', 'skills'));
    expect(adapter.getCommandsDir('/project')).toBe(join('/project', '.claude', 'commands'));
    expect(adapter.getRulesDir('/project')).toBe(join('/project', '.claude', 'rules'));
    expect(adapter.getAgentsDir('/project')).toBe(join('/project', '.claude', 'agents'));
  });

  it('formats with YAML frontmatter', () => {
    const adapter = getAdapter('claude');
    const result = adapter.formatCommandFile(sampleCommand, 'body');
    expect(result).toContain('---');
    expect(result).toContain('flowcompass:requirements');
  });

  it('returns correct command file path', () => {
    const adapter = getAdapter('claude');
    expect(adapter.getCommandFilePath('requirements')).toBe('flowcompass/requirements.md');
  });
});

describe('CommandAdapterRegistry', () => {
  it('registers and retrieves adapter', () => {
    const registry = new CommandAdapterRegistry();
    const adapter = getAdapter('claude');
    registry.register(adapter);
    expect(registry.get('claude')).toBe(adapter);
    expect(registry.list()).toContain('claude');
  });

  it('returns undefined for unknown tool', () => {
    const registry = new CommandAdapterRegistry();
    expect(registry.get('unknown')).toBeUndefined();
  });
});
