'use server';

import { BACKEND_URL } from '@/lib/config';
import { getRequest } from '@/lib/http.utils';
import { List } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';

export const getUserList = async () => {
  return getRequest<List<User>>(`${BACKEND_URL}/api/user/list`);
};

export const getUserProfile = async () => {
  return getRequest<User>(`${BACKEND_URL}/api/user/profile`);
};
