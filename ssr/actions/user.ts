'use server';
import { OfficerRegistrationData } from '@/lib/types/officer.types';
import { ssrClient } from '../client';
import { BACKEND_URL } from '@/lib/config';
import { revalidatePath } from 'next/cache';

export const registerUser = async (
  data: Omit<OfficerRegistrationData, 'joinedDate'> & { joinedDate: string },
  path: string
) => {
  const res = await ssrClient.post(`${BACKEND_URL}/api/user/register`, data);
  revalidatePath(path);
  return res;
};
