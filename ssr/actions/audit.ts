'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Note } from '@/lib/types/note.types';
import { AuditInput } from '@/lib/types/audit.types';
import { revalidatePath } from 'next/cache';

export const createAudit = async (data: AuditInput, path: string, accessToken?: string) => {
  const res = await ssrClient.post<Note>(
    `${BACKEND_URL}/api/task-v2/audit`,
    data,
    accessToken
  );
  if (res.isOk) {
    revalidatePath(path);
  }
  return res;
};

export const deleteAudit = async (data: { id: string }, accessToken?: string) => {
  return ssrClient.post<boolean>(`${BACKEND_URL}/api/note/remove`, data, accessToken);
};
