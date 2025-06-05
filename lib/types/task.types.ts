import { UploadedFile } from './file.types';
import { User } from './user.types';

export enum TaskStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REVIEWED = 'reviewed',
}
export type TaskPriority = 'medium' | 'low' | 'high' | 'very-high';
export type CreateMemoTaskType = {
  title: string;
  description?: string;
  assigner: string;
  startDate: string;
  endDate: string;
  documentNumber: string;
  marking?: string;
  markingVoiceUrl?: string;
  markingDate?: string;
};

export type Task = {
  _id: string;
  assignees: User[];
  title: string;
  startDate: string; //
  dueDate: string; //
  description?: string;
  createdBy: User;
  completedDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type CreateWorkGroupTaskType = {
  title: string;
  description?: string;
  assigner: string;
  startDate: string;
  endDate: string;
  name: string;
  leader: string;
  members: string[];
};

export type TaskStatusChangeType = {
  status: TaskStatus;
  taskId: string;
};

export type Memo = {
  _id: string;
  documentNumber?: string;
  marking?: string;
  markingVoiceUrl?: string;
  markingDate?: string;
};

export type WorkGroup = {
  _id: string;
  name: string;
  leader?: User;
  members: User[];
  marking?: string;
  markingVoiceUrl?: string;
  markingDate?: string;
};

export interface ICreateTaskInput {
  title: string;
  description?: string;
  assignees: string[];
  startDate: Date;
  dueDate?: Date;
  fileIds?: string[]; // optional
  priority: 'low' | 'medium' | 'high' | 'urgent'; // added priority field
}

export type TaskDetail = {
  _id: string;
  assignees: User[];
  title: string;
  startDate: string; //
  dueDate: string; //
  description?: string;
  createdBy: User;
  completedDate?: string;
  status: TaskStatus;
  priority: TaskPriority;
  files: UploadedFile[];
  notes: any[];
};
