import { describe, it, expect } from 'vitest';
import { resolveCommand } from '../../src/core/command-resolver.js';
import { resolveSkill } from '../../src/core/skill-resolver.js';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CONFIG_DIR = join(__dirname, '..', '..', 'config');

describe('path traversal protection', () => {
  it('rejects command name with ..', () => {
    expect(() => resolveCommand('..', CONFIG_DIR)).toThrow();
  });

  it('rejects command name with /', () => {
    expect(() => resolveCommand('foo/bar', CONFIG_DIR)).toThrow();
  });

  it('rejects command name with \\', () => {
    expect(() => resolveCommand('foo\\bar', CONFIG_DIR)).toThrow();
  });

  it('rejects skill name with ..', () => {
    expect(() => resolveSkill('..', CONFIG_DIR)).toThrow();
  });

  it('rejects skill name with /', () => {
    expect(() => resolveSkill('foo/bar', CONFIG_DIR)).toThrow();
  });

  it('rejects uppercase command name (allowlist)', () => {
    expect(() => resolveCommand('FOO', CONFIG_DIR)).toThrow();
  });

  it('rejects command name with spaces', () => {
    expect(() => resolveCommand('foo bar', CONFIG_DIR)).toThrow();
  });
});
