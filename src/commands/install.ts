import { join } from 'node:path';
import { copyDir, readText, writeText, fileExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { getAdapter } from '../core/adapters.js';
import { resolveCommand, listCommands } from '../core/command-resolver.js';
import { detectProjectTools, getToolByValue, isInteractive, SUPPORTED_TOOLS, type ToolOption } from '../core/tools.js';
import { StateManager, KNOWLEDGE_DIR } from '../core/state-manager.js';
import { showWelcome } from '../ui/welcome-screen.js';
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
  try {
    const { projectDir, configDir } = options;

    // 1. Detect project tools
    const detectedTools = detectProjectTools(projectDir);

    // 2. Resolve which tools to install for
    const selectedTools = await resolveTools(options, detectedTools);

    // 3. Install for each tool
    for (const tool of selectedTools) {
      await installForTool(tool, projectDir, configDir);
    }

    // 4. Initialize state.json
    const primaryTool = selectedTools[0];
    const stateManager = new StateManager(projectDir);
    await stateManager.reset(primaryTool.value, primaryTool.mode);
    logger.verbose('Initialized .knowledge/state.json');

    // 5. Copy stage-mapping to .knowledge
    const stageMappingSrc = join(configDir, 'stage-mapping.yaml');
    const knowledgeDir = join(projectDir, KNOWLEDGE_DIR);
    if (fileExists(stageMappingSrc)) {
      writeText(join(knowledgeDir, 'stage-mapping.yaml'), readText(stageMappingSrc));
      logger.verbose('Copied stage-mapping.yaml to .knowledge/');
    }

    // 6. Ensure .gitignore
    ensureGitignore(projectDir);

    // 7. Summary
    logger.info('');
    logger.success(`Installed for: ${selectedTools.map((t) => t.name).join(', ')}`);
    logger.info(`8 commands, 16 skills, 18 agents, and rules per tool`);
    logger.info('');

    if (selectedTools.some((t) => t.mode === 'cli')) {
      logger.info(`Quick start (CLI):  flowcompass run investigation`);
    }
    const colonTool = selectedTools.find((t) => t.value === 'claude' || t.value === 'opencode');
    if (colonTool) {
      logger.info(`Quick start (IDE):  /flowcompass:investigation`);
    }
    logger.info('');
  } catch (err) {
    logger.error(`安装失败: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}

async function installForTool(tool: ToolOption, projectDir: string, configDir: string): Promise<void> {
  const adapter = getAdapter(tool.value);
  logger.info(`Installing for ${tool.name}...`);

  // 1. Copy skills
  const skillsSrc = join(configDir, 'skills');
  const skillsDest = adapter.getSkillsDir(projectDir);
  copyDir(skillsSrc, skillsDest);

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
  const commands = await listCommands(configDir);
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

async function resolveTools(
  options: InstallOptions,
  detectedTools: ToolOption[],
): Promise<ToolOption[]> {
  // --tools flag (comma-separated or "all")
  if (options.tools) {
    if (options.tools === 'all') return [...SUPPORTED_TOOLS];
    return options.tools.split(',').map((v) => {
      const tool = getToolByValue(v.trim());
      if (!tool) throw new Error(`Unknown tool: ${v.trim()}. Supported: ${SUPPORTED_TOOLS.map((t) => t.value).join(', ')}`);
      return tool;
    });
  }

  // --tool flag (single, backward compat)
  if (options.tool) {
    const tool = getToolByValue(options.tool);
    if (!tool) throw new Error(`Unknown tool: ${options.tool}. Supported: ${SUPPORTED_TOOLS.map((t) => t.value).join(', ')}`);
    return [tool];
  }

  // Interactive mode
  if (isInteractive()) {
    showWelcome();

    const { select } = await import('@inquirer/prompts');
    const choices = SUPPORTED_TOOLS.map((t) => ({
      name: detectedTools.some((d) => d.value === t.value)
        ? `${t.name} (detected)`
        : t.name,
      value: t.value,
      description: t.mode === 'cli' ? 'CLI 驱动模式' : '文件驱动模式',
    }));

    const selected = await select({
      message: '选择目标 AI 工具',
      choices,
      default: detectedTools[0]?.value ?? 'claude',
    });

    const tool = getToolByValue(selected);
    return tool ? [tool] : [SUPPORTED_TOOLS[0]];
  }

  // Non-interactive fallback: use detected tools, else claude
  if (detectedTools.length > 0) {
    logger.info(`Detected: ${detectedTools.map((t) => t.name).join(', ')}`);
    return detectedTools;
  }

  logger.info('No tools detected, defaulting to Claude Code');
  return [SUPPORTED_TOOLS[0]];
}
