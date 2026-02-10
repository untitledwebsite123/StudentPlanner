import type { Task } from '../types';
import { addDays, addHours, formatISO } from 'date-fns';

const now = new Date();

export const seedTasks: Task[] = [
  {
    id: 'seed-1',
    title: 'Discrete Math problem set 4',
    course: 'MATH230',
    kind: 'assignment',
    priority: 'high',
    estimatedHours: 3,
    dueAt: formatISO(addDays(now, 1)),
    status: 'pending',
    createdAt: formatISO(now),
  },
  {
    id: 'seed-2',
    title: 'Organic Chem lab prep',
    course: 'CHEM210',
    kind: 'lab',
    priority: 'medium',
    estimatedHours: 2,
    dueAt: formatISO(addHours(addDays(now, 2), 4)),
    status: 'pending',
    createdAt: formatISO(now),
  },
  {
    id: 'seed-3',
    title: 'Morning meditation',
    kind: 'habit',
    repeats: 'daily',
    priority: 'low',
    status: 'pending',
    streak: 4,
    createdAt: formatISO(now),
  },
  {
    id: 'seed-4',
    title: 'CS301 midterm study block',
    course: 'CS301',
    kind: 'exam',
    priority: 'high',
    estimatedHours: 5,
    dueAt: formatISO(addDays(now, 5)),
    status: 'in-progress',
    createdAt: formatISO(now),
  },
];
