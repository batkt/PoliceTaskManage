'use server';

import { TOKEN_KEY } from '@/lib/config';
import { cookies } from 'next/headers';

export const getAuthHeaders = async (token?: string) => {
  return {
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const reponseChecker = async (response: Response) => {
  const data = await response.json();

  if (data.code === 401) {
    const cookie = await cookies();
    if (cookie.has('TOKEN_KEY')) cookie.delete(TOKEN_KEY);
  }
  return {
    isOk: true,
    ...data,
  };
};

export async function isAuthenticated(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_KEY)?.value;
    return token;
  } catch (error) {
    return undefined;
  }
}
