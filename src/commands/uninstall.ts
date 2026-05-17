import { rmSync } from 'node:fs';
import { logger } from '../utils/logger.js';
import { getAdapter } from '../core/adapters.js';
import { detectProjectTools, isInteractive, type ToolOption } from '../core/tools.js';
import { resolveTools } from '../utils/tool-resolver.js';

export interface UninstallOptions {
  projectDir: string;
  tool?: string;
  tools?: string;
}

export async function uninstall(options: UninstallOptions): Promise<void> {
  try {
    const { projectDir } = options;

    // 1. Detect project tools
    const detectedTools = detectProjectTools(projectDir);

    // 2. Resolve which tools to uninstall for
    const selectedTools = await resolveTools(options, detectedTools);

    // 3. Show confirmation in interactive mode
    if (isInteractive()) {
      const { confirm } = await import('@inquirer/prompts');
      const toolNames = selectedTools.map((t) => t.name).join(', ');
      const confirmed = await confirm({
        message: `确认移除以下工具的 Skills/Commands/Rules/Agents 目录？(${toolNames})`,
        default: false,
      });
      if (!confirmed) {
        logger.info('已取消卸载。');
        return;
      }
    }

    // 4. Uninstall for each tool
    for (const tool of selectedTools) {
      uninstallForTool(tool, projectDir);
    }

    // 5. Summary
    logger.info('');
    logger.success(`Uninstalled for: ${selectedTools.map((t) => t.name).join(', ')}`);
    logger.info('.knowledge/ 目录已保留（用户数据）。');
    logger.info('');
  } catch (err) {
    logger.error(`Uninstall failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}

function uninstallForTool(tool: ToolOption, projectDir: string): void {
  const adapter = getAdapter(tool.value);
  logger.info(`Uninstalling for ${tool.name}...`);

  // 1. Remove skills
  removeDir(adapter.getSkillsDir(projectDir), 'skills');

  // 2. Remove rules
  removeDir(adapter.getRulesDir(projectDir), 'rules');

  // 3. Remove agents
  removeDir(adapter.getAgentsDir(projectDir), 'agents');

  // 4. Remove commands
  removeDir(adapter.getCommandsDir(projectDir), 'commands');
}

function removeDir(dirPath: string, label: string): void {
  try {
    rmSync(dirPath, { recursive: true, force: true });
    logger.verbose(`Removed ${label}: ${dirPath}`);
  } catch {
    logger.verbose(`Skipped ${label} (not found): ${dirPath}`);
  }
}

