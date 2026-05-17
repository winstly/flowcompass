import { STAGE_ORDER } from '../types.js';

const VALID_NAME_RE = /^[a-z0-9-]+$/;

export function validateName(name: string): void {
  if (!VALID_NAME_RE.test(name)) {
    throw new Error(`Invalid name: must match /^[a-z0-9-]+$/`);
  }
}

export function validatePathSegment(segment: string, label: string): void {
  if (!segment || segment.includes('..') || segment.includes('/') || segment.includes('\\') || segment.includes('\0')) {
    throw new Error(`Invalid ${label}: must not contain path separators or traversal sequences`);
  }
}

export function stripCrlf(content: string): string {
  return content.replace(/\r\n/g, '\n');
}

export function getStageOrderIndex(name: string): number {
  return (STAGE_ORDER as readonly string[]).indexOf(name);
}
