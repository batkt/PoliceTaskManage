'use server';

import { BACKEND_URL } from '@/lib/config';
import { postRequest } from '@/lib/http.utils';
import { User } from '@/lib/types/user.types';
import { cookies } from 'next/headers';

type LoginInputType = {
  workerId: string;
  password: string;
};

export type LoginResponseType = {
  accessToken: string;
  user: User;
};

export const loginAction = async (data: LoginInputType) => {
  const res = await postRequest<LoginResponseType>(
    `${BACKEND_URL}/api/auth/login`,
    data
  );

  if (res.code === 200) {
    const cookie = await cookies();
    cookie.set('accessToken', res.data?.accessToken);
  }
  return res;
};

export const logoutAction = async () => {
  const cookie = await cookies();
  cookie.delete('accessToken');
  return true;
};
