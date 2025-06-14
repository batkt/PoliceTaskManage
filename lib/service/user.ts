'use client';

import { httpRequest } from '@/lib/http.utils';
import { AuthUser, User } from '@/lib/types/user.types';
import { List } from '../types/global.types';

export const getUserProfile = async (token?: string) => {
  return httpRequest.get<AuthUser>('/user/profile', token);
};

export const getUserList = async (queryString?: string, token?: string) => {
  return httpRequest.get<List<User>>(
    `/user/list${queryString ? `?${queryString}` : ''}`,
    token
  );
};
