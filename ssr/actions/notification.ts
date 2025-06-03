'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';

export const allNotifSeen = async () => {
  return ssrClient.post(`${BACKEND_URL}/api/notification/seen`);
};

export const notifRead = async (body: { id: string }) => {
  return ssrClient.post(`${BACKEND_URL}/api/notification/read`, body);
};
