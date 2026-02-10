import type { Task } from '../types';

export interface WorkloadStats {
  totalHours: number;
  pendingHours: number;
  completedThisWeek: number;
  byCourse: Record<string, number>;
}

export const computeWorkload = (tasks: Task[]): WorkloadStats => {
  return tasks.reduce<WorkloadStats>(
    (acc, task) => {
      const hours = task.estimatedHours ?? 0;
      acc.totalHours += hours;
      if (task.status !== 'done') acc.pendingHours += hours;
      if (task.course) {
        acc.byCourse[task.course] = (acc.byCourse[task.course] ?? 0) + hours;
      }
      if (task.completedAt) {
        const completed = new Date(task.completedAt);
        const now = new Date();
        const diff = Math.abs(now.getTime() - completed.getTime());
        if (diff <= 7 * 24 * 60 * 60 * 1000) acc.completedThisWeek += 1;
      }
      return acc;
    },
    { totalHours: 0, pendingHours: 0, completedThisWeek: 0, byCourse: {} },
  );
};
