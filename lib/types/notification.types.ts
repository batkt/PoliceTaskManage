export type Notification = {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message?: string;
  taskId?: string;
  read: boolean;
  seen: boolean;
  createdAt: string;
};

export type NotificationType = 'task' | 'message' | 'system';
