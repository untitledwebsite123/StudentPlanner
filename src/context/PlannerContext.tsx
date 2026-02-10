import { createContext, useContext, useEffect, useReducer } from 'react';
import type { PlannerState, Task } from '../types';
import { seedTasks } from '../data/seed';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'student-planner-state-v1';

const defaultState: PlannerState = {
  tasks: seedTasks,
  courses: Array.from(new Set(seedTasks.map((task) => task.course).filter(Boolean))) as string[],
  filters: {
    course: 'all',
    kind: 'all',
    priority: 'all',
    search: '',
  },
};

type Action =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: { id: string } }
  | { type: 'TOGGLE_STATUS'; payload: { id: string } }
  | { type: 'SET_FILTERS'; payload: PlannerState['filters'] }
  | { type: 'IMPORT_STATE'; payload: PlannerState }
  | { type: 'RESET_STATE' };

function plannerReducer(state: PlannerState, action: Action): PlannerState {
  switch (action.type) {
    case 'IMPORT_STATE':
      return action.payload;
    case 'RESET_STATE':
      return defaultState;
    case 'ADD_TASK': {
      const newTask: Task = { ...action.payload, id: nanoid(), createdAt: new Date().toISOString() };
      const courses = newTask.course && !state.courses.includes(newTask.course)
        ? [...state.courses, newTask.course]
        : state.courses;
      return { ...state, tasks: [newTask, ...state.tasks], courses };
    }
    case 'UPDATE_TASK':
      return { ...state, tasks: state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task)) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((task) => task.id !== action.payload.id) };
    case 'TOGGLE_STATUS':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id
            ? {
                ...task,
                status: task.status === 'done' ? 'pending' : 'done',
                completedAt: task.status === 'done' ? undefined : new Date().toISOString(),
                streak: task.kind === 'habit' && task.status !== 'done' ? (task.streak ?? 0) + 1 : task.streak,
              }
            : task,
        ),
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

const PlannerContext = createContext<{
  state: PlannerState;
  dispatch: React.Dispatch<Action>;
}>({ state: defaultState, dispatch: () => undefined });

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(plannerReducer, defaultState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'IMPORT_STATE', payload: JSON.parse(stored) as PlannerState });
      }
    } catch (err) {
      console.warn('Failed to hydrate planner state', err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return <PlannerContext.Provider value={{ state, dispatch }}>{children}</PlannerContext.Provider>;
};

export const usePlanner = () => {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
};
