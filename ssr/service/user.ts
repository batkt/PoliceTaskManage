import { List } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';

export const getUserList = async (queryString?: string) => {
  return ssrClient.get<List<User>>(
    `${BACKEND_URL}/api/user/list${queryString ? `?${queryString}` : ''}`
  );
};

export const getAllUsers = async () => {
  return ssrClient.get<User[]>(`${BACKEND_URL}/api/user/all`);
};
