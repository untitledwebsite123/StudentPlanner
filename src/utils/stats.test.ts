import { describe, expect, it } from 'vitest';
import { computeWorkload } from './stats';
import type { Task } from '../types';

const makeTask = (overrides: Partial<Task>): Task => ({
  id: 't',
  title: 'task',
  kind: 'assignment',
  priority: 'medium',
  status: 'pending',
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe('computeWorkload', () => {
  it('aggregates hours and courses', () => {
    const stats = computeWorkload([
      makeTask({ estimatedHours: 3, course: 'CS101' }),
      makeTask({ estimatedHours: 2, course: 'CS101', status: 'done', completedAt: new Date().toISOString() }),
      makeTask({ estimatedHours: 1, course: 'MATH200' }),
    ]);

    expect(stats.totalHours).toBe(6);
    expect(stats.pendingHours).toBe(4);
    expect(stats.byCourse['CS101']).toBe(5);
    expect(stats.byCourse['MATH200']).toBe(1);
    expect(stats.completedThisWeek).toBe(1);
  });
});
