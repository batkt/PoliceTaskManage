'use client';

import { httpRequest } from '@/lib/http.utils';
import { Branch } from '../types/branch.types';

export const getBranches = async (token?: string) => {
  return httpRequest.get<Branch[]>('/branch/', token);
};
