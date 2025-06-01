'use client';

import {
  getAuthHeaders,
  getToken,
  httpRequest,
  TOKEN_KEY,
} from '@/lib/http.utils';
import { User } from '@/lib/types/user.types';

type LoginInputType = {
  workerId: string;
  password: string;
};

export type LoginResponseType = {
  accessToken: string;
  user: User;
};

export const login = async (data: LoginInputType) => {
  const res = await httpRequest.post<LoginResponseType>('/auth/login', data);

  if (res.code === 200) {
    localStorage.setItem(TOKEN_KEY, res.data?.accessToken);
  }
  return res;
};

// export const logoutAction = async () => {
//   const cookie = await cookies();
//   cookie.delete('accessToken');
//   return true;
// };

export async function checkAuth(): Promise<boolean> {
  const token = getToken();

  if (!token) {
    return false;
  }

  try {
    // Verify token validity
    const response = await httpRequest.get('/auth/verify', {
      headers: getAuthHeaders(),
    });

    if (response.code === 200) {
      return true;
    }

    // If token is invalid, try to refresh it
    // if (response.status === 401) {
    //   const newToken = await refreshToken();
    //   return !!newToken;
    // }

    return false;
  } catch (error) {
    return false;
  }
}
