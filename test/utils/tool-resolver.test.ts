import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveTools } from '../../src/utils/tool-resolver.js';
import { SUPPORTED_TOOLS } from '../../src/core/tools.js';

describe('tool-resolver', () => {
  beforeEach(async () => {
    // Mock isInteractive to return false
    const tools = await import('../../src/core/tools.js');
    vi.spyOn(tools, 'isInteractive').mockReturnValue(false);
  });

  it('should return single tool with --tool flag', async () => {
    const result = await resolveTools({ tool: 'claude' }, []);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('claude');
  });

  it('should return multiple tools with --tools flag', async () => {
    const result = await resolveTools({ tools: 'claude,cursor' }, []);
    expect(result).toHaveLength(2);
    expect(result[0].value).toBe('claude');
    expect(result[1].value).toBe('cursor');
  });

  it('should return all tools with --tools all', async () => {
    const result = await resolveTools({ tools: 'all' }, []);
    expect(result).toHaveLength(SUPPORTED_TOOLS.length);
  });

  it('should throw on unknown tool', async () => {
    await expect(resolveTools({ tool: 'unknown' }, [])).rejects.toThrow('Unknown tool: unknown');
  });

  it('should throw on unknown tool in comma-separated list', async () => {
    await expect(resolveTools({ tools: 'claude,unknown' }, [])).rejects.toThrow('Unknown tool: unknown');
  });

  it('should return detected tools when no flags provided', async () => {
    const detected = [SUPPORTED_TOOLS[0]];
    const result = await resolveTools({}, detected);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('claude');
  });

  it('should default to claude when no tools detected and non-interactive', async () => {
    const result = await resolveTools({}, []);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe('claude');
  });
});
