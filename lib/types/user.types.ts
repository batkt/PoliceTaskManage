import { Branch } from './branch.types';

export type User = {
  _id: string;
  workerId: string;
  surname: string;
  givenname: string;
  branch?: Branch; // Branch object or its ID
  rank: string;
  position: string;
  role: 'user' | 'super-admin' | 'admin';
  joinedDate?: string;
  profileImageUrl?: string;
};
