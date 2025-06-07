export interface StatsCount {
  totalUsers: number;
  onlineUsers: number;
  total: number;
  pending: number;
  active: number;
  completed: number;
  overdue: number;
  in_progress: number;
}
export type TaskCounts = Record<string, number>;
