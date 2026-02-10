import type { Task } from '../types';
import { usePlanner } from '../context/PlannerContext';
import { formatDue, isOverdue } from '../utils/dates';
import clsx from 'clsx';

interface Props {
  task: Task;
}

const kindColors: Record<Task['kind'], string> = {
  assignment: '#3B82F6',
  exam: '#F87171',
  lab: '#10B981',
  reading: '#A78BFA',
  habit: '#34D399',
  errand: '#FBBF24',
};

export const TaskItem = ({ task }: Props) => {
  const { dispatch } = usePlanner();
  const dueLabel = formatDue(task.dueAt);

  return (
    <article className="task-card">
      <div className="task-left">
        <input
          type="checkbox"
          checked={task.status === 'done'}
          onChange={() => dispatch({ type: 'TOGGLE_STATUS', payload: { id: task.id } })}
        />
        <div>
          <div className="task-heading">
            <span className="task-dot" style={{ backgroundColor: kindColors[task.kind] }} />
            <strong>{task.title}</strong>
            {task.course && <span className="course-chip">{task.course}</span>}
          </div>
          {task.notes && <p className="task-notes">{task.notes}</p>}
          <div className="task-meta">
            {dueLabel && (
              <span className={clsx('meta-chip', { overdue: isOverdue(task.dueAt) })}>
                {dueLabel}
              </span>
            )}
            {task.estimatedHours && <span className="meta-chip">≈ {task.estimatedHours}h</span>}
            <span className={clsx('priority', task.priority)}>{task.priority}</span>
            {task.kind === 'habit' && task.streak && <span className="meta-chip">🔥 {task.streak} day streak</span>}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button onClick={() => dispatch({ type: 'DELETE_TASK', payload: { id: task.id } })}>Delete</button>
      </div>
    </article>
  );
};
