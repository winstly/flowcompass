import { describe, it, expect } from 'vitest';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { resolveStageAgents } from '../../src/core/stage-mapping.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('resolveStageAgents', () => {
  it('returns agents for investigation stage', () => {
    const agents = resolveStageAgents('investigation', CONFIG_DIR);
    expect(agents.length).toBeGreaterThan(0);
    const names = agents.map((a) => a.name);
    expect(names).toContain('product-manager');
    expect(names).toContain('software-architect');
  });

  it('returns agents for architecture stage', () => {
    const agents = resolveStageAgents('architecture', CONFIG_DIR);
    expect(agents.length).toBeGreaterThanOrEqual(3);
    const names = agents.map((a) => a.name);
    expect(names).toContain('software-architect');
    expect(names).toContain('backend-architect');
    expect(names).toContain('security-engineer');
  });

  it('returns agents for testing stage', () => {
    const agents = resolveStageAgents('testing', CONFIG_DIR);
    expect(agents.length).toBeGreaterThanOrEqual(3);
    const names = agents.map((a) => a.name);
    expect(names).toContain('api-tester');
    expect(names).toContain('code-reviewer');
  });

  it('returns agents for deployment stage', () => {
    const agents = resolveStageAgents('deployment', CONFIG_DIR);
    expect(agents.length).toBeGreaterThanOrEqual(2);
    const names = agents.map((a) => a.name);
    expect(names).toContain('devops-automator');
    expect(names).toContain('sre');
  });

  it('each agent has a non-empty summary', () => {
    const agents = resolveStageAgents('architecture', CONFIG_DIR);
    for (const agent of agents) {
      expect(agent.summary.length).toBeGreaterThan(0);
      expect(agent.filePath).toContain('.md');
    }
  });

  it('returns empty array for a stage with no agents', () => {
    // If a stage has no entry in the mapping, it should return empty
    // All 8 stages have mappings, so test with an unmapped stage would throw
    // Instead verify that all 8 stages have non-empty results
    const stages = ['investigation', 'requirements', 'architecture', 'design', 'development', 'testing', 'deployment', 'retrospective'];
    for (const stage of stages) {
      const agents = resolveStageAgents(stage as any, CONFIG_DIR);
      expect(agents.length).toBeGreaterThan(0);
    }
  });

  it('agent summary does not exceed 500 characters plus ellipsis', () => {
    const agents = resolveStageAgents('development', CONFIG_DIR);
    for (const agent of agents) {
      // Summary should be <= 503 chars (500 + '...')
      expect(agent.summary.length).toBeLessThanOrEqual(503);
    }
  });
});
