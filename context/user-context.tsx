'use client';

import { createContext, ReactNode, useContext } from 'react';
import { User } from '@/lib/types/user.types';
import { Branch } from '@/lib/types/branch.types';

const UserContext = createContext<{
  users: User[];
  branches: Branch[];
}>({
  users: [],
  branches: [],
});

export const useUsers = () => {
  return useContext(UserContext);
};

interface IProps {
  children: ReactNode;
  data?: User[];
  branchData?: Branch[];
}

const UserProvider = ({ children, data = [], branchData = [] }: IProps) => {
  return (
    <UserContext.Provider
      value={{
        users: data,
        branches: branchData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
