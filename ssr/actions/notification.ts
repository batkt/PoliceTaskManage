'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { revalidatePath } from 'next/cache';

export const allNotifSeen = async (accessToken?: string) => {
  return ssrClient.post(`${BACKEND_URL}/api/notification/seen`, accessToken);
};

export const notifRead = async (
  body: { notificationId: string },
  path?: string,
  accessToken?: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/notification/read`,
    body,
    accessToken
  );
  if (path) {
    revalidatePath(path);
  }
  return res;
};
