import { useState } from 'react';
import type { FormEvent } from 'react';
import { usePlanner } from '../context/PlannerContext';
import type { Priority, Task, TaskKind } from '../types';

const defaultForm = {
  title: '',
  course: '',
  kind: 'assignment' as TaskKind,
  priority: 'medium' as Priority,
  estimatedHours: '',
  dueAt: '',
  repeats: 'daily' as 'daily' | 'weekly',
  notes: '',
};

export const TaskComposer = () => {
  const { addTask } = usePlanner();
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    try {
      const payload: Omit<Task, 'id' | 'createdAt' | 'completedAt'> = {
        title: form.title.trim(),
        course: form.course || undefined,
        kind: form.kind,
        priority: form.priority,
        estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : undefined,
        dueAt: form.dueAt || undefined,
        repeats: form.kind === 'habit' ? form.repeats : null,
        notes: form.notes || undefined,
        status: 'pending',
        streak: form.kind === 'habit' ? 0 : undefined,
      };
      await addTask(payload);
      setForm(defaultForm);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="composer">
      <h2>Capture something new</h2>
      <form onSubmit={handleSubmit} className="composer-form">
        <input
          type="text"
          placeholder="Write essay draft, attend lab, start habit..."
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Course (e.g., CS201)"
          value={form.course}
          onChange={(e) => setForm((prev) => ({ ...prev, course: e.target.value.toUpperCase() }))}
        />
        <select value={form.kind} onChange={(e) => setForm((prev) => ({ ...prev, kind: e.target.value as TaskKind }))}>
          <option value="assignment">Assignment</option>
          <option value="exam">Exam</option>
          <option value="lab">Lab</option>
          <option value="reading">Reading</option>
          <option value="habit">Habit</option>
          <option value="errand">Errand</option>
        </select>
        <select value={form.priority} onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as Priority }))}>
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input
          type="datetime-local"
          value={form.dueAt}
          onChange={(e) => setForm((prev) => ({ ...prev, dueAt: e.target.value }))}
        />
        {form.kind === 'habit' ? (
          <select
            value={form.repeats}
            onChange={(e) => setForm((prev) => ({ ...prev, repeats: e.target.value as 'daily' | 'weekly' }))}
          >
            <option value="daily">Repeats daily</option>
            <option value="weekly">Repeats weekly</option>
          </select>
        ) : (
          <input
            type="number"
            min="0"
            step="0.5"
            placeholder="Est. hours"
            value={form.estimatedHours}
            onChange={(e) => setForm((prev) => ({ ...prev, estimatedHours: e.target.value }))}
          />
        )}
        <textarea
          placeholder="Add notes, resources, motivation"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add to planner'}
        </button>
      </form>
    </section>
  );
};
