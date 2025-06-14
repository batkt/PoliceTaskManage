'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { User } from '@/lib/types/user.types';
import { Branch } from '@/lib/types/branch.types';
import { useAuth } from './auth-context';

const UserContext = createContext<{
  users: User[];
  allBranch: Branch[];
  branches: Branch[];
}>({
  users: [],
  allBranch: [],
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
  const { authUser } = useAuth();
  const branches = useMemo((): Branch[] => {
    if (!branchData || branchData?.length < 1) {
      return [];
    }

    if (authUser?.role === 'super-admin') {
      return branchData;
    }

    const ownBranch = branchData.find((b) => b._id === authUser?.branch?._id);
    if (!ownBranch) {
      return [];
    }
    const children = branchData.filter((b) =>
      b.path.includes(`${ownBranch.path}/${ownBranch._id}`)
    );

    return [ownBranch, ...children];
  }, [authUser, branchData]);

  return (
    <UserContext.Provider
      value={{
        users: data,
        allBranch: branchData,
        branches: branches,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
