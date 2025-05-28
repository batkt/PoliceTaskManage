import { Branch } from './branch.types';

export type User = {
  workerId: string;
  surname: string;
  givenname: string;
  branch?: Branch; // Branch object or its ID
  rank: string;
  position: string;
  password: string;
  role: 'user' | 'super-admin' | 'admin';
  joinedDate?: Date;
};
