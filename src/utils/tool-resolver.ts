import { getToolByValue, isInteractive, SUPPORTED_TOOLS, type ToolOption } from '../core/tools.js';
import { showWelcome } from '../ui/welcome-screen.js';
import { logger } from './logger.js';

export interface ToolResolverOptions {
  tool?: string;
  tools?: string;
}

export async function resolveTools(
  options: ToolResolverOptions,
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
