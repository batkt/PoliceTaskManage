import { User } from './user.types';

export type TaskStatus = 'pending' | 'active' | 'processing' | 'completed';
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
  assigner: User;
  title: string;
  startDate: string; //
  endDate: string; //
  description?: string;
  createdBy: User;
  completedDate?: string;
  status: TaskStatus;
  type: string;
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
