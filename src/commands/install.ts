import { join } from 'node:path';
import { rmSync } from 'node:fs';
import { copyDir, readText, writeText, fileExists, KNOWLEDGE_DIR, acquireLock, releaseLock, countSubdirs, countFiles } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { getAdapter } from '../core/adapters.js';
import { listCommands } from '../core/command-resolver.js';
import { detectProjectTools, type ToolOption } from '../core/tools.js';
import { resolveTools } from '../utils/tool-resolver.js';
import { stripCrlf } from '../utils/validation.js';

export interface InstallOptions {
  projectDir: string;
  configDir: string;
  tool?: string;
  tools?: string;
}

function ensureGitignore(projectDir: string): void {
  const gitignorePath = join(projectDir, '.gitignore');
  const entry = `${KNOWLEDGE_DIR}/`;

  if (!fileExists(gitignorePath)) {
    writeText(gitignorePath, entry + '\n');
    logger.verbose('Created .gitignore with .knowledge/');
    return;
  }

  const content = readText(gitignorePath);
  if (!content.includes(entry)) {
    writeText(gitignorePath, content.trimEnd() + '\n' + entry + '\n');
    logger.verbose('Added .knowledge/ to .gitignore');
  }
}

export async function install(options: InstallOptions): Promise<void> {
  const { projectDir, configDir } = options;
  const lockPath = join(projectDir, '.knowledge', '.install.lock');

  if (!acquireLock(lockPath)) {
    logger.error('Another install is already running. If this is incorrect, delete .knowledge/.install.lock and retry.');
    process.exitCode = 1;
    return;
  }

  try {
    // 1. Detect project tools
    const detectedTools = detectProjectTools(projectDir);

    // 2. Resolve which tools to install for
    const selectedTools = await resolveTools(options, detectedTools);

    // 3. Install for each tool
    for (const tool of selectedTools) {
      installForTool(tool, projectDir, configDir);
    }

    // 4. Ensure .gitignore
    ensureGitignore(projectDir);

    // 5. Initialize .knowledge/org/
    const orgSrc = join(configDir, 'org');
    const orgDest = join(projectDir, KNOWLEDGE_DIR, 'org');
    if (fileExists(orgSrc)) {
      copyDir(orgSrc, orgDest);
      logger.verbose('Initialized .knowledge/org/');
    }

    // 6. Summary
    const skillCount = countSubdirs(join(configDir, 'skills'));
    const commandCount = countFiles(join(configDir, 'commands'), '.md');
    const agentCount = countFiles(join(configDir, 'agents'), '.md');

    logger.info('');
    logger.success(`Installed for: ${selectedTools.map((t) => t.name).join(', ')}`);
    logger.info(`${commandCount} commands, ${skillCount} skills, ${agentCount} agents, and rules per tool`);
    logger.info('');

    const colonTool = selectedTools.find((t) => t.value === 'claude' || t.value === 'opencode');
    if (colonTool) {
      logger.info(`Quick start (IDE):  /flowcompass:investigation`);
    }
    logger.info('');
  } catch (err) {
    logger.error(`Install failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  } finally {
    releaseLock(lockPath);
  }
}

function cleanDir(dirPath: string): void {
  try {
    rmSync(dirPath, { recursive: true, force: true });
  } catch {
    // Directory doesn't exist, ignore
  }
}

function installForTool(tool: ToolOption, projectDir: string, configDir: string): void {
  const adapter = getAdapter(tool.value);
  logger.info(`Installing for ${tool.name}...`);

  // 0. Clean existing directories to remove stale files
  cleanDir(adapter.getSkillsDir(projectDir));
  cleanDir(adapter.getRulesDir(projectDir));
  cleanDir(adapter.getAgentsDir(projectDir));
  cleanDir(adapter.getCommandsDir(projectDir));

  // 1. Copy skills (with namespace prefix)
  const skillsSrc = join(configDir, 'skills');
  const skillsDest = adapter.getSkillsDir(projectDir);
  const prefix = adapter.skillPrefix;
  copyDir(skillsSrc, skillsDest, undefined, (relativePath) => {
    // Prefix top-level skill directories: structural-decomposition → flowcompass-structural-decomposition
    const parts = relativePath.split('/');
    if (parts.length > 0) {
      parts[0] = `${prefix}-${parts[0]}`;
    }
    return parts.join('/');
  });

  // 2. Copy rules
  const rulesSrc = join(configDir, 'rules');
  const rulesDest = adapter.getRulesDir(projectDir);
  copyDir(rulesSrc, rulesDest);

  // 3. Copy agents
  const agentsSrc = join(configDir, 'agents');
  const agentsDest = adapter.getAgentsDir(projectDir);
  copyDir(agentsSrc, agentsDest);

  // 4. Generate commands
  const commandsDest = adapter.getCommandsDir(projectDir);
  const commands = listCommands(configDir);
  for (const cmdDef of commands) {
    const srcPath = join(configDir, 'commands', `${cmdDef.name}.md`);
    const srcContent = readText(srcPath);
    const normalized = stripCrlf(srcContent);
    const secondDashIndex = normalized.indexOf('---', 4);
    const body = secondDashIndex >= 0 ? normalized.slice(secondDashIndex + 3).trim() : normalized;

    const formatted = adapter.formatCommandFile(cmdDef, body);
    const filePath = adapter.getCommandFilePath(cmdDef.name);
    const fullPath = join(commandsDest, filePath);
    writeText(fullPath, formatted);
  }
}

