import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync, rmSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { install } from '../../src/commands/install.js';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('install', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'flowcompass-install-'));
  });

  afterEach(() => {
    rmSync(tempDir, { recursive: true, force: true });
  });

  it('creates .claude/skills with 16 skills', async () => {
    await install({ projectDir: tempDir, configDir: CONFIG_DIR, tool: 'claude' });
    const skillsDir = join(tempDir, '.claude', 'skills');
    expect(existsSync(skillsDir)).toBe(true);

    const skills = readdirSync(skillsDir);
    expect(skills.length).toBe(16);
    expect(skills).toContain('pm-structural-decomposition');
    expect(skills).toContain('pm-project-closure-iteration');
    expect(skills).toContain('pm-visual-verification');
  });

  it('creates .claude/commands/flowcompass with 8 commands', async () => {
    await install({ projectDir: tempDir, configDir: CONFIG_DIR, tool: 'claude' });
    const commandsDir = join(tempDir, '.claude', 'commands', 'flowcompass');
    expect(existsSync(commandsDir)).toBe(true);

    const commands = readdirSync(commandsDir);
    expect(commands.length).toBe(8);
    expect(commands).toContain('investigation.md');
    expect(commands).toContain('retrospective.md');
  });

  it('creates .claude/rules with flowcompass-rules.md', async () => {
    await install({ projectDir: tempDir, configDir: CONFIG_DIR, tool: 'claude' });
    const rulesFile = join(tempDir, '.claude', 'rules', 'flowcompass-rules.md');
    expect(existsSync(rulesFile)).toBe(true);
    const content = readFileSync(rulesFile, 'utf-8');
    expect(content).toContain('HARD-GATE');
  });

  it('each command file has YAML frontmatter with flowcompass name', async () => {
    await install({ projectDir: tempDir, configDir: CONFIG_DIR, tool: 'claude' });
    const cmdFile = join(tempDir, '.claude', 'commands', 'flowcompass', 'requirements.md');
    const content = readFileSync(cmdFile, 'utf-8');
    expect(content).toContain('---');
    expect(content).toContain('flowcompass:requirements');
  });

  it('each skill has SKILL.md', async () => {
    await install({ projectDir: tempDir, configDir: CONFIG_DIR, tool: 'claude' });
    const skillFile = join(tempDir, '.claude', 'skills', 'pm-structural-decomposition', 'SKILL.md');
    expect(existsSync(skillFile)).toBe(true);
    const content = readFileSync(skillFile, 'utf-8');
    expect(content).toContain('pm-structural-decomposition');
  });
});
