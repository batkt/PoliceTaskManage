import { User } from './user.types';

export type Activity = {
  _id: string;
  taskId: string;
  userId: User;
  type: string;
  message?: string;
  createdAt: string;
};
