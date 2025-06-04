import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, differenceInHours } from 'date-fns';
import { mn } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isEmptyObject = (obj: any) => {
  return (
    obj &&
    typeof obj === 'object' &&
    !Array.isArray(obj) &&
    Object.keys(obj).length === 0
  );
};

export function formatRelativeTime(date: Date | string): string {
  const inputDate = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();

  const hoursDiff = differenceInHours(now, inputDate);

  if (hoursDiff < 24) {
    return formatDistanceToNow(inputDate, { addSuffix: false, locale: mn });
  }

  return format(inputDate, 'yyyy-MM-dd HH:mm:ss');
}

export function isOverdue(endDate: Date | undefined): boolean {
  if (!endDate) return false;
  return new Date() > endDate;
}
