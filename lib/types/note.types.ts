import { User } from './user.types';

export type Note = {
  _id: string;
  taskId: string;
  content: string;
  createdAt: string;
  createdBy: User;
};

export type NoteInput = {
  taskId: string;
  content: string;
};
