'use client';

import { httpRequest } from '@/lib/http.utils';
import { UploadedFile } from '../types/file.types';

export const fileUpload = async (data: FormData, token?: string) => {
  return httpRequest.postFormData<UploadedFile>('/file/upload', data, token);
};
