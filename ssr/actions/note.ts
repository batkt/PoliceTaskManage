'use server';

import { BACKEND_URL } from '@/lib/config';
import { ssrClient } from '../client';
import { Note, NoteInput } from '@/lib/types/note.types';

export const createNote = async (data: NoteInput) => {
  return ssrClient.post<Note>(`${BACKEND_URL}/api/note/`, data);
};

export const deleteNote = async (data: { id: string }) => {
  return ssrClient.post<boolean>(`${BACKEND_URL}/api/note/remove`, data);
};
