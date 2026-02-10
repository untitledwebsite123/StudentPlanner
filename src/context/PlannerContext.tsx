import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { Filters, PlannerState, Task } from '../types';
import { api } from '../api/client';

const defaultFilters: Filters = {
  course: 'all',
  kind: 'all',
  priority: 'all',
  search: '',
};

const defaultState: PlannerState = {
  tasks: [],
  courses: [],
  filters: defaultFilters,
};

const deriveCourses = (tasks: Task[]) =>
  Array.from(new Set(tasks.map((task) => task.course).filter(Boolean))) as string[];

type Action =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'UPSERT_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Filters };

function reducer(state: PlannerState, action: Action): PlannerState {
  switch (action.type) {
    case 'SET_TASKS': {
      return { ...state, tasks: action.payload, courses: deriveCourses(action.payload) };
    }
    case 'UPSERT_TASK': {
      const tasks = state.tasks.some((t) => t.id === action.payload.id)
        ? state.tasks.map((task) => (task.id === action.payload.id ? action.payload : task))
        : [action.payload, ...state.tasks];
      return { ...state, tasks, courses: deriveCourses(tasks) };
    }
    case 'REMOVE_TASK': {
      const tasks = state.tasks.filter((task) => task.id !== action.payload);
      return { ...state, tasks, courses: deriveCourses(tasks) };
    }
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    default:
      return state;
  }
}

interface PlannerContextValue {
  state: PlannerState;
  loading: boolean;
  setFilters: (filters: Filters) => void;
  refresh: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleStatus: (id: string, status: Task['status']) => Promise<void>;
}

const PlannerContext = createContext<PlannerContextValue | null>(null);

export const PlannerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const tasks = await api<Task[]>('/api/tasks');
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const setFilters = (filters: Filters) => dispatch({ type: 'SET_FILTERS', payload: filters });

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => {
    const created = await api<Task>('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
    dispatch({ type: 'UPSERT_TASK', payload: created });
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    const updated = await api<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    dispatch({ type: 'UPSERT_TASK', payload: updated });
  };

  const deleteTask = async (id: string) => {
    await api<void>(`/api/tasks/${id}`, { method: 'DELETE' });
    dispatch({ type: 'REMOVE_TASK', payload: id });
  };

  const toggleStatus = async (id: string, status: Task['status']) => {
    await updateTask(id, { status });
  };

  const value = useMemo(
    () => ({ state, loading, setFilters, refresh, addTask, updateTask, deleteTask, toggleStatus }),
    [state, loading],
  );

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
};

export const usePlanner = () => {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
};
