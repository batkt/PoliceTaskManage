'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Branch } from '@/lib/types/branch.types';
import { useAuth } from './auth-context';
import { getBranches } from '@/lib/service/branch';

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
}

const UserProvider = ({ children }: IProps) => {
  const { authUser, accessToken } = useAuth();

  const [branchData, setBranchData] = useState<Branch[]>([]);

  const getAllBranchData = useCallback(async () => {
    if (accessToken) {
      const res = await getBranches(accessToken)
      if (res.isOk) {
        setBranchData(res.data)
      }
    }
  }, [accessToken])

  useEffect(() => {
    getAllBranchData()
  }, [getAllBranchData])

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
