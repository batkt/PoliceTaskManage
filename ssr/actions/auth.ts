'use server';

import { decode } from 'jsonwebtoken';
import { BACKEND_URL, TOKEN_KEY } from '@/lib/config';
import { AuthUser } from '@/lib/types/user.types';
import { cookies } from 'next/headers';
import { ssrClient } from '../client';

type LoginInputType = {
  workerId: string;
  password: string;
};

export type LoginResponseType = {
  accessToken: string;
  user: AuthUser;
};

export const loginAction = async (data: LoginInputType) => {
  const res = await ssrClient.post<LoginResponseType>(
    `${BACKEND_URL}/api/auth/login`,
    data
  );

  if (res.code === 200) {
    const decoded = decode(res.data.accessToken) as { exp: number };
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_KEY, res.data.accessToken, {
      httpOnly: false,
      secure: false,
      sameSite: 'lax',
      expires: decoded.exp * 1000,
      path: '/',
    });
  }
  return res;
};

export const logoutAction = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);

  return true;
};

export const changePassword = async (data: any) => {
  return await ssrClient.post<{}>(
    `${BACKEND_URL}/api/auth/change-password`,
    data
  );
};
