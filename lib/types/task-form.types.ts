import { Control } from 'react-hook-form';

export interface BaseFormData {
  title: string;
  type: 'memo' | 'work-group';
  startDate?: Date;
  endDate?: Date;
  description?: string;
  assigner: '';
  priority: 'low' | 'medium' | 'high';
}

export interface MemoFormData {
  marking?: string;
  markingVoiceUrl?: string;
  markingDate?: Date;
  documentNumber?: string;
}

export interface WorkGroupFormData {
  name: string;
  leader: string;
  members: string[];
  marking?: string;
  markingVoiceUrl?: string;
  markingDate?: Date;
}

export type TaskFormData = BaseFormData &
  Partial<MemoFormData & WorkGroupFormData>;

export interface FormComponentProps {
  watch?: any;
  control: any;
}
