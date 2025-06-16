import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Note } from '@/lib/types/note.types';

export const getTaskNotes = async (taskId: string) => {
  return ssrClient.get<Note[]>(
    `${BACKEND_URL}/api/note/getTaskNotes/${taskId}`
  );
};
