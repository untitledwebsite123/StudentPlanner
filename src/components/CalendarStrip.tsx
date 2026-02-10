import { addDays, format } from 'date-fns';
import { usePlanner } from '../context/PlannerContext';

export const CalendarStrip = () => {
  const { state } = usePlanner();
  const today = new Date();
  const days = Array.from({ length: 5 }, (_, index) => addDays(today, index));

  return (
    <div className="calendar-strip">
      {days.map((day) => {
        const dateStr = day.toISOString();
        const tasks = state.tasks.filter((task) => task.dueAt?.slice(0, 10) === dateStr.slice(0, 10));
        const hours = tasks.reduce((sum, task) => sum + (task.estimatedHours ?? 0), 0);
        return (
          <div key={day.toISOString()} className="calendar-day">
            <p className="section-kicker">{format(day, 'EEE')}</p>
            <h4>{format(day, 'MMM d')}</h4>
            <p className="muted">{tasks.length} tasks · {hours.toFixed(1)}h</p>
          </div>
        );
      })}
    </div>
  );
};
