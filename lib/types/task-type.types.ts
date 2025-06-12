export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'select'
  | 'date'
  | 'user-select'
  | 'multi-user-select';

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  showInTable: boolean;
  placeholder?: string;
  options?: string[]; // For select
}

export type CreateFormField = Omit<FormField, 'id'> & {
  tempId: string;
};

export interface DynamicForm {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFormData {
  name: string;
  description?: string;
  fields: CreateFormField[];
}
