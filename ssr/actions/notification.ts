'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { revalidatePath } from 'next/cache';

export const allNotifSeen = async () => {
  return ssrClient.post(`${BACKEND_URL}/api/notification/seen`);
};

export const notifRead = async (
  body: { notificationId: string },
  path?: string
) => {
  const res = await ssrClient.post(
    `${BACKEND_URL}/api/notification/read`,
    body
  );
  if (path) {
    revalidatePath(path);
  }
  return res;
};
