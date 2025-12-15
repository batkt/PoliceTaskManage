import { List } from '@/lib/types/global.types';
import { Notification } from '@/lib/types/notification.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';

export const getNotificaitonList = async (queryString?: string, token?: string) => {
  return ssrClient.get<List<Notification>>(
    `${BACKEND_URL}/api/notification/list${queryString ? `?${queryString}` : ''
    }`,
    token
  );
};
