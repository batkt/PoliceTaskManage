'use client';

import { createContext, ReactNode, useContext } from 'react';
import { User } from '@/lib/types/user.types';

const UserContext = createContext<{
  users: User[];
}>({
  users: [],
});

export const useUsers = () => {
  return useContext(UserContext);
};

interface IProps {
  children: ReactNode;
  data?: User[];
}

const UserProvider = ({ children, data = [] }: IProps) => {
  return (
    <UserContext.Provider
      value={{
        users: data,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
