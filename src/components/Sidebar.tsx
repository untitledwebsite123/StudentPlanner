import { useMemo } from 'react';
import { usePlanner } from '../context/PlannerContext';

const smartFilters = [
  { label: 'Today', key: 'today' },
  { label: 'This Week', key: 'week' },
  { label: 'Habits', key: 'habit' },
];

export const Sidebar = () => {
  const { state, dispatch } = usePlanner();

  const counts = useMemo(() => {
    return {
      today: state.tasks.filter((task) => task.dueAt && new Date(task.dueAt).getDate() === new Date().getDate()).length,
      week: state.tasks.filter((task) => task.dueAt && new Date(task.dueAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000).length,
      habit: state.tasks.filter((task) => task.kind === 'habit').length,
    };
  }, [state.tasks]);

  return (
    <aside className="sidebar">
      <div>
        <h2>Quick Views</h2>
        {smartFilters.map((filter) => (
          <button key={filter.key} className="sidebar-btn" disabled>
            <span>{filter.label}</span>
            <span>{counts[filter.key as keyof typeof counts]}</span>
          </button>
        ))}
      </div>
      <div>
        <h2>Courses</h2>
        <button
          className={`sidebar-btn ${state.filters.course === 'all' ? 'active' : ''}`}
          onClick={() => dispatch({ type: 'SET_FILTERS', payload: { ...state.filters, course: 'all' } })}
        >
          <span>All courses</span>
          <span>{state.tasks.length}</span>
        </button>
        {state.courses.map((course) => (
          <button
            key={course}
            className={`sidebar-btn ${state.filters.course === course ? 'active' : ''}`}
            onClick={() => dispatch({ type: 'SET_FILTERS', payload: { ...state.filters, course } })}
          >
            <span>{course}</span>
            <span>{state.tasks.filter((task) => task.course === course).length}</span>
          </button>
        ))}
      </div>
    </aside>
  );
};
