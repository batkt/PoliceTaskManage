import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Audit } from '@/lib/types/audit.types';

export const getAuditData = async (taskId: string, token?: string) => {
  return ssrClient.get<Audit[]>(
    `${BACKEND_URL}/api/audit/task/${taskId}`,
    token
  );
};
