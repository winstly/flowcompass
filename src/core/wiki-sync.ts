import { join, resolve } from 'node:path';
import { readText, writeText, ensureDir, fileExists } from '../utils/fs.js';
import { logger } from '../utils/logger.js';
import { KNOWLEDGE_DIR } from './state-manager.js';

const SUMMARIES_DIR = 'wiki/summaries';
const LOGS_DIR = 'logs';

export interface WikiSyncOptions {
  projectDir: string;
  category: string;
  filename: string;
  content: string;
  skillName: string;
  level: string;
}

function validateWikiPath(segment: string, label: string): void {
  if (segment.includes('..') || segment.includes('/') || segment.includes('\\') || segment.includes('\0')) {
    throw new Error(`Invalid ${label}: path traversal detected`);
  }
}

export function syncWiki(options: WikiSyncOptions): void {
  const { projectDir, category, filename, content, skillName, level } = options;

  validateWikiPath(category, 'wiki-category');
  validateWikiPath(filename, 'wiki filename');

  // 1. Write summary file
  const summaryPath = join(projectDir, KNOWLEDGE_DIR, SUMMARIES_DIR, category, filename);

  // Verify resolved path stays within the project
  const expectedRoot = resolve(join(projectDir, KNOWLEDGE_DIR, SUMMARIES_DIR));
  const resolvedPath = resolve(summaryPath);
  if (!resolvedPath.startsWith(expectedRoot)) {
    throw new Error('Wiki sync path escaped expected directory');
  }

  writeText(summaryPath, content);
  logger.verbose(`Created ${summaryPath}`);

  // 2. Update wiki/index.md
  updateWikiIndex(projectDir, category, filename);

  // 3. Append to evolution log
  appendEvolutionLog(projectDir, skillName, level);
}

function updateWikiIndex(projectDir: string, category: string, filename: string): void {
  const indexPath = join(projectDir, KNOWLEDGE_DIR, 'wiki', 'index.md');
  let indexContent: string;

  if (fileExists(indexPath)) {
    indexContent = readText(indexPath);
  } else {
    indexContent = '# Project Wiki\n\n## Summaries\n';
  }

  const entry = `- [${category}/${filename}](${SUMMARIES_DIR}/${category}/${filename})`;
  if (indexContent.includes(entry)) return;

  const sectionHeader = `### ${category}`;
  if (indexContent.includes(sectionHeader)) {
    const insertPos = indexContent.indexOf(sectionHeader) + sectionHeader.length;
    indexContent = indexContent.slice(0, insertPos) + '\n' + entry + indexContent.slice(insertPos);
  } else {
    indexContent += `\n${sectionHeader}\n${entry}\n`;
  }
  writeText(indexPath, indexContent);
  logger.verbose('Updated wiki/index.md');
}

function appendEvolutionLog(projectDir: string, skillName: string, level: string): void {
  const logPath = join(projectDir, KNOWLEDGE_DIR, LOGS_DIR, 'evolution-log.md');
  ensureDir(join(projectDir, KNOWLEDGE_DIR, LOGS_DIR));

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const entry = `## [${timestamp}] ${skillName} | ${level} level\n\n**Type**: ${skillName.replace('pm-', '').replace(/-/g, '_')}\n**Level**: ${level}\n**Changes**: synced to wiki\n`;

  if (fileExists(logPath)) {
    const existing = readText(logPath);
    writeText(logPath, existing + '\n' + entry);
  } else {
    writeText(logPath, '# Evolution Log\n\n' + entry);
  }
  logger.verbose('Appended to evolution-log.md');
}
