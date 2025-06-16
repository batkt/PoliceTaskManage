import { User } from './user.types';

export type AuditInput = {
  taskId: string;
  result: string;
  comments: string;
};

export type Audit = {
  _id: string;
  task: string;
  result: string;
  comments: string;
  checkedBy: User;
  createdAt: string;
};
