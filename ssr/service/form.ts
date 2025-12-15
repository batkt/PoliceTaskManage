import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { FormTemplate } from '@/lib/types/form.types';

export const getAllForms = (token?: string) => {
  return ssrClient.get<FormTemplate[]>(`${BACKEND_URL}/api/form/`, token);
};

export const getFormTemplate = (id: string, token?: string) => {
  return ssrClient.get<FormTemplate>(`${BACKEND_URL}/api/form/${id}`, token);
};
