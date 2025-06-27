'use client';

import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Branch } from '@/lib/types/branch.types';
import { useAuth } from './auth-context';

const UserContext = createContext<{
  allBranch: Branch[];
  branches: Branch[];
}>({
  allBranch: [],
  branches: [],
});

export const useUsers = () => {
  return useContext(UserContext);
};

interface IProps {
  children: ReactNode;
  branchData?: Branch[];
}

const UserProvider = ({ children, branchData = [] }: IProps) => {
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
        allBranch: branchData,
        branches: branches,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
