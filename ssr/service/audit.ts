import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Audit } from '@/lib/types/audit.types';

export const getAuditData = async (taskId: string) => {
  const res = await ssrClient.get<Audit[]>(
    `${BACKEND_URL}/api/audit/task/${taskId}`
  );

  if (res.code === 200) {
    return res.data;
  }

  return null;
};
