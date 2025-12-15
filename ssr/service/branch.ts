import { Branch } from '@/lib/types/branch.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';

export const getAllBranches = async (token?: string) => {
  return ssrClient.get<Branch[]>(`${BACKEND_URL}/api/branch/`, token);
};

export const getOwnBranches = async (token?: string) => {
  return ssrClient.get<Branch[]>(`${BACKEND_URL}/api/branch/getOwnBranches`, token);
};
