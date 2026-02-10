# StudentPlanner – Product Plan

## Purpose
Help students orchestrate academics, personal wellness, and campus life from a single, delightful control center. Capture assignments, exams, labs, habits, and errands with contextual views so nothing slips through the cracks.

## Target Personas
- **STEM undergrad** balancing problem sets, labs, and club duties.
- **Grad student** juggling research milestones, TA work, and publications.
- **High-school senior** preparing for exams, applications, and extracurriculars.

## Experience Principles
1. **Academic-first**: Coursework taxonomy (course codes, assignment types, credits) built-in.
2. **Contextual clarity**: Dashboard surfaces upcoming deadlines, workload graph, and wellbeing cues.
3. **Momentum-friendly**: Habit streaks, focus timers, and weekly reflections.
4. **Offline-ready**: Local persistence with optional export for backups.

## Feature Set
### v1 Scope
- Task types: Assignment, Exam, Lab, Reading, Habit, Errand.
- Fields per task: course, type, estimated hours, due date/time, recurrence (for habits), priority.
- Views:
  - **Today**: actionable checklist sorted by time/priority.
  - **Upcoming**: timeline grouped by course/week.
  - **Habits**: tracker with streak counts.
  - **Calendar strip** summarizing load per day.
- Filters: course, type, priority, completion.
- Stats: credit-weighted workload, remaining hours this week, streak counts.
- Data persistence via `localStorage` with export/import (JSON download/upload).

### Stretch ideas (not fully implemented yet)
- Integrations (Google Calendar, LMS), Pomodoro timer, collaborative mode.

## Architecture
```
src/
  components/
    Layout/
      AppShell.tsx
      Sidebar.tsx
    dashboard/
      CalendarStrip.tsx
      WorkloadCard.tsx
      HabitCard.tsx
    tasks/
      TaskComposer.tsx
      TaskList.tsx
      TaskItem.tsx
  context/
    PlannerContext.tsx   // reducer + persistence
  hooks/
    useLocalStorage.ts   // typed wrapper around storage
  utils/
    dates.ts             // bucketing helpers
    stats.ts             // workload + streak math
  data/
    seed.ts
  types.ts
  App.tsx
  main.tsx
  styles.css
```

## Data Model
```ts
export type TaskKind = 'assignment' | 'exam' | 'lab' | 'reading' | 'habit' | 'errand';
export interface Task {
  id: string;
  title: string;
  course?: string; // e.g., "CS201"
  kind: TaskKind;
  priority: 'low' | 'medium' | 'high';
  estimatedHours?: number;
  dueAt?: string; // ISO string
  repeats?: 'daily' | 'weekly' | null;
  streak?: number; // for habits
  notes?: string;
  status: 'pending' | 'in-progress' | 'done';
  createdAt: string;
  completedAt?: string;
}
```
Reducer actions: `ADD_TASK`, `UPDATE_TASK`, `DELETE_TASK`, `TOGGLE_STATUS`, `SET_FILTERS`, `IMPORT_STATE`, `RESET_STATE`.

## UX Flow
1. **Sidebar** lists courses + quick filters (Today, This Week, Habits).
2. **Hero dashboard** highlights first three due items, estimated hours remaining, wellness reminder.
3. **Task Composer** encourages capturing assignment details with suggestions for course codes.
4. **Task Board** grouped by view (Today, Upcoming, Habits). Habits show streak chips.
5. **Stats column** quantifies workload vs capacity and habit streaks.

## Visual Language
- Color accents per task type (assignment=blue, exam=red, habit=green).
- Soft gradients + glassy cards; Inter font; supportive icons.
- Responsive layout: 3-column on desktop → stacked on mobile.

## Technical Plan
- Vite + React + TypeScript.
- State via context + reducer; persisted to `localStorage` (debounced writes).
- `date-fns` for due buckets + formatting.
- `nanoid` for IDs.
- `clsx` for conditional classNames.
- Tests with Vitest for `stats.ts` utilities.

## Success Criteria
- Can add/edit/delete tasks with per-course metadata.
- Views update immediately and persist across refreshes.
- Stats card reflects accurate totals (unit-tested).
- Build + tests run cleanly (`npm run build`, `npm run test`).

## Execution Checklist
- [x] Scaffold Vite React TS app.
- [x] Define data model + context.
- [ ] Build UI components & styling.
- [ ] Implement export/import + tests.
- [ ] Run `npm run test` and `npm run build`.
- [ ] Provide usage instructions in README.
