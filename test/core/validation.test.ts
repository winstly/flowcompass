import { describe, it, expect } from 'vitest';
import { validateName, validatePathSegment, stripCrlf, getStageOrderIndex } from '../../src/utils/validation.js';

describe('validateName', () => {
  it('accepts valid names', () => {
    expect(() => validateName('requirements')).not.toThrow();
    expect(() => validateName('pm-structural-decomposition')).not.toThrow();
    expect(() => validateName('a123')).not.toThrow();
  });

  it('rejects path traversal', () => {
    expect(() => validateName('..')).toThrow();
    expect(() => validateName('../etc')).toThrow();
  });

  it('rejects slashes', () => {
    expect(() => validateName('foo/bar')).toThrow();
    expect(() => validateName('foo\\bar')).toThrow();
  });

  it('rejects empty and special chars', () => {
    expect(() => validateName('')).toThrow();
    expect(() => validateName('foo bar')).toThrow();
    expect(() => validateName('FOO')).toThrow();
    expect(() => validateName('foo.bar')).toThrow();
  });

  it('rejects null bytes', () => {
    expect(() => validateName('foo\0bar')).toThrow();
  });
});

describe('validatePathSegment', () => {
  it('accepts valid segments', () => {
    expect(() => validatePathSegment('architecture', 'category')).not.toThrow();
    expect(() => validatePathSegment('structural-decomposition.md', 'file')).not.toThrow();
  });

  it('rejects traversal', () => {
    expect(() => validatePathSegment('..', 'test')).toThrow();
    expect(() => validatePathSegment('../etc', 'test')).toThrow();
  });

  it('rejects slashes and backslashes', () => {
    expect(() => validatePathSegment('foo/bar', 'test')).toThrow();
    expect(() => validatePathSegment('foo\\bar', 'test')).toThrow();
  });

  it('rejects null bytes', () => {
    expect(() => validatePathSegment('foo\0bar', 'test')).toThrow();
  });

  it('rejects empty', () => {
    expect(() => validatePathSegment('', 'test')).toThrow();
  });
});

describe('stripCrlf', () => {
  it('converts CRLF to LF', () => {
    expect(stripCrlf('foo\r\nbar')).toBe('foo\nbar');
  });

  it('preserves LF-only content', () => {
    expect(stripCrlf('foo\nbar')).toBe('foo\nbar');
  });

  it('handles mixed line endings', () => {
    expect(stripCrlf('a\r\nb\nc\r\n')).toBe('a\nb\nc\n');
  });
});

describe('getStageOrderIndex', () => {
  it('returns correct index for known stages', () => {
    expect(getStageOrderIndex('investigation')).toBe(0);
    expect(getStageOrderIndex('retrospective')).toBe(7);
  });

  it('returns -1 for unknown stages', () => {
    expect(getStageOrderIndex('unknown')).toBe(-1);
  });
});
