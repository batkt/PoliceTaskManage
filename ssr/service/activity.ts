import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Activity } from '@/lib/types/activity.types';

export const getActivities = async (taskId: string) => {
  const res = await ssrClient.get<Activity[]>(
    `${BACKEND_URL}/api/actvivity/${taskId}/activities`
  );

  if (res.code === 200) {
    return res.data;
  }

  return null;
};
