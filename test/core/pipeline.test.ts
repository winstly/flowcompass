import { describe, it, expect } from 'vitest';
import { Pipeline, assertStageName } from '../../src/core/pipeline.js';
import { STAGE_ORDER } from '../../src/types.js';

describe('Pipeline', () => {
  it('initializes with all stages pending', () => {
    const pipeline = Pipeline.create();
    const state = pipeline.getState();
    expect(state.active).toBe(false);
    expect(state.current_command).toBeNull();
    expect(state.tool).toBe('claude');
    expect(state.mode).toBe('cli');
    expect(state.context.iteration).toBe(0);
    for (const stage of STAGE_ORDER) {
      expect(state.stages[stage].status).toBe('pending');
      expect(state.stages[stage].skills).toEqual([]);
    }
  });

  it('starts at investigation with skills', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a', 'skill-b']);
    const state = pipeline.getState();
    expect(state.active).toBe(true);
    expect(state.current_command).toBe('investigation');
    expect(state.stages.investigation.status).toBe('in_progress');
    expect(state.stages.investigation.skills).toHaveLength(2);
    expect(state.stages.investigation.current_skill_index).toBe(0);
    expect(state.context.iteration).toBe(1);
  });

  it('completes a stage and moves to next', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation');
    pipeline.complete('investigation');
    pipeline.start('requirements');
    const state = pipeline.getState();
    expect(state.stages.investigation.status).toBe('completed');
    expect(state.stages.requirements.status).toBe('in_progress');
  });

  it('throws when completing a stage that is not in_progress', () => {
    const pipeline = Pipeline.create();
    expect(() => pipeline.complete('investigation')).toThrow();
  });

  it('throws when completing a non-existent stage', () => {
    const pipeline = Pipeline.create();
    // @ts-expect-error testing invalid input
    expect(() => pipeline.complete('nonexistent')).toThrow('not found');
  });

  it('retrospective returns undefined without pipeline-next', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation');
    pipeline.complete('investigation');
    const next = pipeline.getNextStage('retrospective');
    expect(next).toBeUndefined();
  });

  it('retrospective returns pipeline-next when provided', () => {
    const pipeline = Pipeline.create();
    const next = pipeline.getNextStage('retrospective', 'investigation');
    expect(next).toBe('investigation');
  });

  it('0-skill stage starts and completes immediately', () => {
    const pipeline = Pipeline.create();
    pipeline.start('deployment');
    expect(pipeline.getState().stages.deployment.status).toBe('in_progress');
    expect(pipeline.getState().stages.deployment.current_skill_index).toBe(-1);
    pipeline.complete('deployment');
    expect(pipeline.getState().stages.deployment.status).toBe('completed');
  });

  it('getStageOrder returns correct sequence', () => {
    expect(Pipeline.getStageOrder()).toEqual([...STAGE_ORDER]);
  });
});

describe('Pipeline skill-level tracking', () => {
  it('startSkill marks a skill as in_progress', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a', 'skill-b']);
    pipeline.startSkill('investigation', 0);
    const state = pipeline.getState();
    expect(state.stages.investigation.skills[0].status).toBe('in_progress');
    expect(state.stages.investigation.current_skill_index).toBe(0);
  });

  it('completeSkill marks a skill as completed and tracks context', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a', 'skill-b']);
    pipeline.startSkill('investigation', 0);
    pipeline.completeSkill('investigation', 0, 'done', '/path/to/output.md');
    const state = pipeline.getState();
    expect(state.stages.investigation.skills[0].status).toBe('completed');
    expect(state.stages.investigation.skills[0].output_summary).toBe('done');
    expect(state.stages.investigation.skills[0].output_path).toBe('/path/to/output.md');
    expect(state.context.completed_skills).toContain('skill-a');
    expect(state.context.last_artifact_path).toBe('/path/to/output.md');
  });

  it('failSkill marks a skill as failed', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    pipeline.startSkill('investigation', 0);
    pipeline.failSkill('investigation', 0, 'Something broke');
    const state = pipeline.getState();
    expect(state.stages.investigation.skills[0].status).toBe('failed');
    expect(state.stages.investigation.skills[0].error_message).toBe('Something broke');
  });

  it('failStage marks the stage as failed', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    pipeline.failStage('investigation', 'Critical failure');
    const state = pipeline.getState();
    expect(state.stages.investigation.status).toBe('failed');
  });

  it('throws when starting skill on non-in_progress stage', () => {
    const pipeline = Pipeline.create();
    expect(() => pipeline.startSkill('investigation', 0)).toThrow('not in progress');
  });

  it('throws when skill index is out of range', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a']);
    expect(() => pipeline.startSkill('investigation', 5)).toThrow('out of range');
  });

  it('getCurrentSkill returns the current skill', () => {
    const pipeline = Pipeline.create();
    pipeline.start('investigation', ['skill-a', 'skill-b']);
    pipeline.startSkill('investigation', 0);
    const skill = pipeline.getCurrentSkill('investigation');
    expect(skill?.skill_name).toBe('skill-a');
    expect(skill?.status).toBe('in_progress');
  });

  it('getCurrentSkill returns undefined for pending stage', () => {
    const pipeline = Pipeline.create();
    expect(pipeline.getCurrentSkill('investigation')).toBeUndefined();
  });
});

describe('assertStageName', () => {
  it('returns valid stage name', () => {
    expect(assertStageName('investigation')).toBe('investigation');
    expect(assertStageName('requirements')).toBe('requirements');
  });

  it('throws for invalid stage name', () => {
    expect(() => assertStageName('invalid')).toThrow('Invalid stage name');
  });
});
