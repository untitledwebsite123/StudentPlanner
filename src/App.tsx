import './styles.css';
import { PlannerProvider, usePlanner } from './context/PlannerContext';
import { Sidebar } from './components/Sidebar';
import { TaskComposer } from './components/TaskComposer';
import { CalendarStrip } from './components/CalendarStrip';
import { TaskList } from './components/TaskList';
import { TaskItem } from './components/TaskItem';
import { StatsPanel } from './components/StatsPanel';

const MainView = () => {
  const { state, loading } = usePlanner();
  const filtered = state.tasks.filter((task) => {
    const { course, kind, priority, search } = state.filters;
    const matchesCourse = course === 'all' || task.course === course;
    const matchesKind = kind === 'all' || task.kind === kind;
    const matchesPriority = priority === 'all' || task.priority === priority;
    const matchesSearch = state.filters.search
      ? task.title.toLowerCase().includes(search.toLowerCase()) || task.notes?.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesCourse && matchesKind && matchesPriority && matchesSearch;
  });

  const today = filtered.filter((task) => task.dueAt && new Date(task.dueAt).toDateString() === new Date().toDateString());
  const upcoming = filtered.filter(
    (task) =>
      task.dueAt &&
      new Date(task.dueAt).getTime() > new Date().getTime() &&
      new Date(task.dueAt).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000,
  );
  const habits = filtered.filter((task) => task.kind === 'habit');

  return (
    <div className="app-grid">
      <Sidebar />
      <main className="main">
        <TaskComposer />
        {loading && <p className="muted">Syncing with cloud…</p>}
        <CalendarStrip />
        <TaskList title="Today" count={today.length}>
          {today.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TaskList>
        <TaskList title="Upcoming" count={upcoming.length}>
          {upcoming.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TaskList>
        <TaskList title="Habits" count={habits.length}>
          {habits.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </TaskList>
      </main>
      <StatsPanel />
    </div>
  );
};

export const App = () => (
  <PlannerProvider>
    <MainView />
  </PlannerProvider>
);

export default App;
