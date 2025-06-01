import { User } from './user.types';

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
  completedDate?: string;
  status: 'pending' | 'active' | 'processing' | 'completed';
  type: string;
  priority: 'medium' | 'low' | 'high' | 'very-high';
};
