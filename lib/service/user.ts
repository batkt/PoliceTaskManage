'use client';

import { httpRequest } from '@/lib/http.utils';
import { User } from '@/lib/types/user.types';

export const getUserProfile = async (token?: string) => {
  return httpRequest.get<User>('/user/profile', token);
};
