'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Note, NoteInput } from '@/lib/types/note.types';
import { revalidatePath } from 'next/cache';

export const createNote = async (data: NoteInput, path: string) => {
  const res = await ssrClient.post<Note>(
    `${BACKEND_URL}/api/task-v2/note`,
    data
  );

  if (res.code === 200) {
    revalidatePath(path);
  }
  return res;
};

export const deleteNote = async (data: { id: string }) => {
  return ssrClient.post<boolean>(`${BACKEND_URL}/api/note/remove`, data);
};
