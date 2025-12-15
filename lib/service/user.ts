'use client';

import { httpRequest } from '@/lib/http.utils';
import { AuthUser, User } from '@/lib/types/user.types';
import { List } from '../types/global.types';

export const getUserData = async () => {
  return httpRequest.get<{ user: AuthUser, accessToken: string }>('/auth/user', undefined, {
    baseUrl: "/internal",
  });
};

export const getUserList = async (queryString?: string, token?: string) => {
  return httpRequest.get<List<User>>(
    `/user/list${queryString ? `?${queryString}` : ''}`,
    token
  );
};

export const getUserByIds = async (ids: string[], token?: string) => {
  return httpRequest.get<User[]>(`/user/getByIds?ids=${ids.join(',')}`, token);
};
