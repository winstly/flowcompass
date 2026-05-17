import { join } from 'node:path';
import { readdirSync } from 'node:fs';
import { readText } from '../utils/fs.js';
import { stripCrlf } from '../utils/validation.js';
import { validateName } from '../utils/validation.js';
import YAML from 'yaml';
import type { StageName } from '../types.js';

export interface AgentInfo {
  name: string;
  filePath: string;
  summary: string;
}

const MAX_SUMMARY_CHARS = 500;

function extractSummary(content: string): string {
  const normalized = stripCrlf(content);
  // Try to extract up to the first ## heading
  const headingMatch = normalized.match(/^## /m);
  if (headingMatch && headingMatch.index !== undefined && headingMatch.index > 0) {
    const summary = normalized.slice(0, headingMatch.index).trim();
    return summary.length <= MAX_SUMMARY_CHARS ? summary : summary.slice(0, MAX_SUMMARY_CHARS) + '...';
  }
  // Fallback: first 500 chars
  return normalized.length <= MAX_SUMMARY_CHARS ? normalized : normalized.slice(0, MAX_SUMMARY_CHARS) + '...';
}

function resolveAgentFileName(shortName: string, agentsDir: string): string | undefined {
  const files = readdirSync(agentsDir);
  // Try exact match first
  const exact = files.find((f) => f === `${shortName}.md`);
  if (exact) return exact;
  // Try suffix match (e.g., "software-architect" → "engineering-software-architect.md")
  const suffix = files.find((f) => f.endsWith(`-${shortName}.md`));
  if (suffix) return suffix;
  return undefined;
}

export function resolveStageAgents(
  stageName: StageName,
  configDir: string,
): AgentInfo[] {
  validateName(stageName);
  const mappingPath = join(configDir, 'stage-mapping.yaml');
  const content = readText(mappingPath);
  const mapping = YAML.parse(stripCrlf(content)) as Record<string, { agents: string[] }>;

  const stageConfig = mapping[stageName];
  if (!stageConfig || !Array.isArray(stageConfig.agents)) {
    return [];
  }

  const agentsDir = join(configDir, 'agents');
  const results: AgentInfo[] = [];

  for (const shortName of stageConfig.agents) {
    const fileName = resolveAgentFileName(shortName, agentsDir);
    if (!fileName) continue;

    const filePath = join(agentsDir, fileName);
    try {
      const agentContent = readText(filePath);
      const summary = extractSummary(agentContent);
      results.push({
        name: shortName,
        filePath,
        summary,
      });
    } catch {
      // Skip agents that can't be read
    }
  }

  return results;
}
