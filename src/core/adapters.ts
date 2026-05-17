import { join } from 'node:path';
import type { ToolCommandAdapter, ToolId, CommandDefinition } from '../types.js';
import YAML from 'yaml';

// --- Registry ---

export class CommandAdapterRegistry {
  private adapters = new Map<string, ToolCommandAdapter>();

  register(adapter: ToolCommandAdapter): void {
    this.adapters.set(adapter.toolId, adapter);
  }

  get(toolId: string): ToolCommandAdapter | undefined {
    return this.adapters.get(toolId);
  }

  list(): string[] {
    return [...this.adapters.keys()];
  }
}

// --- Adapters ---

function makeColonAdapter(
  toolId: ToolId,
  dirName: string,
  commandPrefix: string,
): ToolCommandAdapter {
  return {
    toolId,
    skillPrefix: 'flowcompass',
    getSkillsDir(targetDir: string): string {
      return join(targetDir, dirName, 'skills');
    },
    getCommandsDir(targetDir: string): string {
      return join(targetDir, dirName, 'commands');
    },
    getRulesDir(targetDir: string): string {
      return join(targetDir, dirName, 'rules');
    },
    getAgentsDir(targetDir: string): string {
      return join(targetDir, dirName, 'agents');
    },
    getCommandFilePath(commandName: string): string {
      return `${commandPrefix}/${commandName}.md`;
    },
    formatCommandFile(definition: CommandDefinition, content: string): string {
      const frontmatter = {
        name: `${commandPrefix}:${definition.name}`,
        description: `${definition.stage}阶段 — ${definition.skills.join(', ')}`,
      };
      return `---\n${YAML.stringify(frontmatter)}---\n\n${content}`;
    },
  };
}

function makeHyphenAdapter(
  toolId: ToolId,
  dirName: string,
  commandPrefix: string,
  rulesDirName: string,
): ToolCommandAdapter {
  return {
    toolId,
    skillPrefix: 'flowcompass',
    getSkillsDir(targetDir: string): string {
      return join(targetDir, dirName, 'skills');
    },
    getCommandsDir(targetDir: string): string {
      return join(targetDir, dirName, 'commands');
    },
    getRulesDir(targetDir: string): string {
      return join(targetDir, rulesDirName);
    },
    getAgentsDir(targetDir: string): string {
      return join(targetDir, dirName, 'agents');
    },
    getCommandFilePath(commandName: string): string {
      return `${commandPrefix}-${commandName}.md`;
    },
    formatCommandFile(definition: CommandDefinition, content: string): string {
      const frontmatter = {
        name: `${commandPrefix}-${definition.name}`,
        description: `${definition.stage}阶段 — ${definition.skills.join(', ')}`,
      };
      return `---\n${YAML.stringify(frontmatter)}---\n\n${content}`;
    },
  };
}

const claudeAdapter = makeColonAdapter('claude', '.claude', 'flowcompass');
const opencodeAdapter = makeHyphenAdapter('opencode', '.opencode', 'flowcompass', '.opencode/rules');
const cursorAdapter = makeHyphenAdapter('cursor', '.cursor', 'flowcompass', '.cursor/rules');
const windsurfAdapter = makeHyphenAdapter('windsurf', '.windsurf', 'flowcompass', '.windsurf/rules');

// Cline uses .clinerules/workflows instead of commands/
const clineAdapter: ToolCommandAdapter = {
  toolId: 'cline',
  skillPrefix: 'flowcompass',
  getSkillsDir(targetDir: string): string {
    return join(targetDir, '.cline', 'skills');
  },
  getCommandsDir(targetDir: string): string {
    return join(targetDir, '.clinerules', 'workflows');
  },
  getRulesDir(targetDir: string): string {
    return join(targetDir, '.clinerules');
  },
  getAgentsDir(targetDir: string): string {
    return join(targetDir, '.cline', 'agents');
  },
  getCommandFilePath(commandName: string): string {
    return `flowcompass-${commandName}.md`;
  },
  formatCommandFile(definition: CommandDefinition, content: string): string {
    return `# flowcompass-${definition.name}\n\n${definition.stage}阶段 — ${definition.skills.join(', ')}\n\n${content}`;
  },
};

// --- Registry with all adapters pre-registered ---

const adapterRegistry = new CommandAdapterRegistry();
adapterRegistry.register(claudeAdapter);
adapterRegistry.register(opencodeAdapter);
adapterRegistry.register(cursorAdapter);
adapterRegistry.register(windsurfAdapter);
adapterRegistry.register(clineAdapter);

export function getAdapter(toolId: string): ToolCommandAdapter {
  const adapter = adapterRegistry.get(toolId);
  if (!adapter) throw new Error(`Unsupported tool: ${toolId}. Supported: ${adapterRegistry.list().join(', ')}`);
  return adapter;
}
