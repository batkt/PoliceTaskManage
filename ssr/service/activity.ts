import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Activity } from '@/lib/types/activity.types';

export const getActivities = async (taskId: string, token?: string) => {
  return ssrClient.get<Activity[]>(
    `${BACKEND_URL}/api/actvivity/${taskId}/activities`,
    token
  );
};
