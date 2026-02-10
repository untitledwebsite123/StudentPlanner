import { useMemo } from 'react';
import { usePlanner } from '../context/PlannerContext';
import { computeWorkload } from '../utils/stats';

export const StatsPanel = () => {
  const { state } = usePlanner();

  const workload = useMemo(() => computeWorkload(state.tasks), [state.tasks]);

  return (
    <aside className="stats-panel">
      <div className="stats-card">
        <p className="section-kicker">Weekly load</p>
        <h4>{workload.pendingHours.toFixed(1)} hrs remaining</h4>
        <p className="muted">{workload.totalHours.toFixed(1)} hrs captured</p>
      </div>
      <div className="stats-card">
        <p className="section-kicker">Momentum</p>
        <h4>{workload.completedThisWeek} tasks cleared</h4>
        <p className="muted">Past 7 days</p>
      </div>
      <div className="stats-card">
        <p className="section-kicker">Course distribution</p>
        <ul>
          {Object.entries(workload.byCourse).map(([course, hours]) => (
            <li key={course}>
              <span>{course}</span>
              <strong>{hours.toFixed(1)}h</strong>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
