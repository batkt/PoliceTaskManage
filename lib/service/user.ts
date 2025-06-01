'use client';

import { httpRequest } from '@/lib/http.utils';
import { User } from '@/lib/types/user.types';
import { List } from '../types/global.types';

export const getUserList = async (queryString?: string) => {
  return httpRequest.get<List<User>>(
    `/user/list${queryString ? `?${queryString}` : ''}`
  );
};

export const getUserProfile = async () => {
  return httpRequest.get<User>('/user/profile');
};

export const getAllUsers = async () => {
  return httpRequest.get<User[]>(`/user/all`);
};
