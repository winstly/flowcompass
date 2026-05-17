import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { syncWiki } from '../../src/core/wiki-sync.js';
import { KNOWLEDGE_DIR } from '../../src/core/state-manager.js';

describe('syncWiki', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'flowcompass-wiki-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates summary file', () => {
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'structural-decomposition.md',
      content: '# Test Output',
      skillName: 'pm-structural-decomposition',
      level: '1',
    });

    const summaryPath = join(tempDir, KNOWLEDGE_DIR, 'wiki/summaries/architecture/structural-decomposition.md');
    expect(existsSync(summaryPath)).toBe(true);
    expect(readFileSync(summaryPath, 'utf-8')).toBe('# Test Output');
  });

  it('creates wiki index if not exists', () => {
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test.md',
      content: 'Test',
      skillName: 'test-skill',
      level: '1',
    });

    const indexPath = join(tempDir, KNOWLEDGE_DIR, 'wiki/index.md');
    expect(existsSync(indexPath)).toBe(true);
    const content = readFileSync(indexPath, 'utf-8');
    expect(content).toContain('architecture');
    expect(content).toContain('test.md');
  });

  it('appends to wiki index if category already exists', () => {
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test1.md',
      content: 'First',
      skillName: 'skill-1',
      level: '1',
    });
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test2.md',
      content: 'Second',
      skillName: 'skill-2',
      level: '1',
    });

    const indexPath = join(tempDir, KNOWLEDGE_DIR, 'wiki/index.md');
    const content = readFileSync(indexPath, 'utf-8');
    expect(content).toContain('test1.md');
    expect(content).toContain('test2.md');
  });

  it('creates evolution log', () => {
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test.md',
      content: 'Test',
      skillName: 'pm-structural-decomposition',
      level: '1',
    });

    const logPath = join(tempDir, KNOWLEDGE_DIR, 'logs/evolution-log.md');
    expect(existsSync(logPath)).toBe(true);
    const content = readFileSync(logPath, 'utf-8');
    expect(content).toContain('pm-structural-decomposition');
  });

  it('appends to existing evolution log', () => {
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test1.md',
      content: 'First',
      skillName: 'skill-1',
      level: '1',
    });
    syncWiki({
      projectDir: tempDir,
      category: 'requirements',
      filename: 'test2.md',
      content: 'Second',
      skillName: 'skill-2',
      level: '2',
    });

    const logPath = join(tempDir, KNOWLEDGE_DIR, 'logs/evolution-log.md');
    const content = readFileSync(logPath, 'utf-8');
    expect(content).toContain('skill-1');
    expect(content).toContain('skill-2');
  });

  it('does not duplicate index entry', () => {
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test.md',
      content: 'Test',
      skillName: 'skill-1',
      level: '1',
    });
    syncWiki({
      projectDir: tempDir,
      category: 'architecture',
      filename: 'test.md',
      content: 'Updated',
      skillName: 'skill-1',
      level: '1',
    });

    const indexPath = join(tempDir, KNOWLEDGE_DIR, 'wiki/index.md');
    const content = readFileSync(indexPath, 'utf-8');
    // Entry format: `- [architecture/test.md](wiki/summaries/architecture/test.md)`
    const entryCount = content.split('- [architecture/test.md]').length - 1;
    expect(entryCount).toBe(1);
  });
});
