export type TaskKind = 'assignment' | 'exam' | 'lab' | 'reading' | 'habit' | 'errand';
export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'done';
export type RepeatFrequency = 'daily' | 'weekly' | null;

export interface Task {
  id: string;
  title: string;
  course?: string;
  kind: TaskKind;
  priority: Priority;
  estimatedHours?: number;
  dueAt?: string; // ISO datetime
  repeats?: RepeatFrequency;
  notes?: string;
  status: TaskStatus;
  streak?: number; // for habits
  createdAt: string;
  completedAt?: string;
}

export interface Filters {
  course: string | 'all';
  kind: TaskKind | 'all';
  priority: Priority | 'all';
  search: string;
}

export interface PlannerState {
  tasks: Task[];
  courses: string[];
  filters: Filters;
}
