import { Branch } from '@/lib/types/branch.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';

export const getAllBranches = async () => {
  return ssrClient.get<Branch[]>(`${BACKEND_URL}/api/branch/`);
};

export const getOwnBranches = async () => {
  return ssrClient.get<Branch[]>(`${BACKEND_URL}/api/branch/getOwnBranches`);
};
