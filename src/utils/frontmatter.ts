import { stripCrlf } from './validation.js';
import YAML from 'yaml';

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns the parsed object or throws if frontmatter is missing/invalid.
 */
export function parseFrontmatter(content: string, name: string): Record<string, unknown> {
  const normalized = stripCrlf(content);
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`No frontmatter found in: ${name}`);
  }
  return YAML.parse(match[1], { maxAliasCount: 10 }) as Record<string, unknown>;
}

/**
 * Validate that all required fields exist in a parsed frontmatter object.
 */
export function requireFields(
  parsed: Record<string, unknown>,
  fields: string[],
  name: string,
): void {
  for (const field of fields) {
    if (!(field in parsed)) {
      throw new Error(`"${name}" missing required field: ${field}`);
    }
  }
}
