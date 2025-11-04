import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

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

function isNotDate(value: any): boolean {
  return !(value instanceof Date) || isNaN(value?.getTime());
}

function convertDate(date: Date | string) {
  let d: Date;
  try {
    if (typeof date === 'string') {
      d = new Date(date);
    } else {
      d = date;
    }
    if (isNotDate(d)) return null;
    return d;
  } catch (err) {
    return null;
  }
}

export function formatDateFull(date: Date | string): string {
  const d = convertDate(date);
  if (!d) return '';
  return format(d, 'yyyy-MM-dd HH:mm:ss');
}

export function isOverdue(endDate: Date | undefined): boolean {
  if (!endDate) return false;
  return new Date() > endDate;
}

export function formatRelativeTime(timestamp: Date | string): string {
  const date = convertDate(timestamp);
  if (!date) return '';

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
}

export const COLORS = {
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
};