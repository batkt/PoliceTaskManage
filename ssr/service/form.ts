import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { FormTemplate } from '@/lib/types/form.types';

export const getAllForms = () => {
  return ssrClient.get<FormTemplate[]>(`${BACKEND_URL}/api/form/`);
};

export const getFormTemplate = (id: string) => {
  return ssrClient.get<FormTemplate>(`${BACKEND_URL}/api/form/${id}`);
};
