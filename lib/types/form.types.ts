import { FormField } from './task-type.types';

export enum FieldTypes {
  TEXT_INPUT = 'text',
  NUMBER_INPUT = 'number',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  DATE = 'date',
  USER_SELECT = 'user-select',
  MULTI_USER_SELECT = 'multi-user-select',
}

export interface FormTemplate {
  _id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
}
