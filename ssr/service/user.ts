import { List } from '@/lib/types/global.types';
import { AuthUser, User } from '@/lib/types/user.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';

export const getUserList = async (queryString?: string, token?: string) => {
  return ssrClient.get<List<User>>(
    `${BACKEND_URL}/api/user/list${queryString ? `?${queryString}` : ''}`,
    token
  );
};

export const getLoggedUser = async (token?: string) => {
  try {
    const res = await ssrClient.get<AuthUser>(
      `${BACKEND_URL}/api/user/profile`, token
    );

    if (res.isOk) {
      return res.data;
    }

    return undefined;
  } catch (err) {
    return undefined;
  }
};
