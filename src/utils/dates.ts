import { differenceInCalendarDays, format, isBefore, isToday } from 'date-fns';

export const formatDue = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (isToday(date)) return 'Today';
  return format(date, 'EEE • MMM d, h:mm a');
};

export const isOverdue = (iso?: string) => {
  if (!iso) return false;
  return isBefore(new Date(iso), new Date());
};

export const daysUntil = (iso?: string) => {
  if (!iso) return null;
  return differenceInCalendarDays(new Date(iso), new Date());
};
