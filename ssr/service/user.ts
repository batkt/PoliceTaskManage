import { List } from '@/lib/types/global.types';
import { AuthUser, User } from '@/lib/types/user.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';

export const getUserList = async (queryString?: string) => {
  return ssrClient.get<List<User>>(
    `${BACKEND_URL}/api/user/list${queryString ? `?${queryString}` : ''}`
  );
};

export const getAllUsers = async () => {
  return ssrClient.get<User[]>(`${BACKEND_URL}/api/user/all`);
};

export const getLoggedUser = async () => {
  try {
    const res = await ssrClient.get<AuthUser>(
      `${BACKEND_URL}/api/user/profile`
    );

    if (res.code === 200) {
      return res.data;
    }

    console.log(res);
    return undefined;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};
