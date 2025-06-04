'use client';

import { getUserProfile } from '@/lib/service/user';
import { CustomResponse } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';
import { LoginResponseType, loginAction } from '@/ssr/actions/auth';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ILoginData {
  workerId: string;
  password: string;
}

interface IAuthContext {
  isAuthenticated: boolean;
  accessToken?: string;
  login: (data: ILoginData) => Promise<CustomResponse<LoginResponseType>>;
  authUser?: User;
  clearUserData: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  accessToken: undefined,
  login: () => Promise.reject({ message: '' }),
  authUser: undefined,
  clearUserData: () => {},
});

interface IAAuthProviderProps {
  children: ReactNode;
  isAuthenticated: boolean;
  accessToken?: string;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({
  children,
  isAuthenticated = false,
  accessToken,
}: IAAuthProviderProps) => {
  const [authUser, setAuthUser] = useState<User | undefined>();
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    const res = await getUserProfile(accessToken);
    if (res.code === 200) {
      setAuthUser(res.data);
    }
    if (res.code === 401) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (!authUser) {
      fetchProfile();
    }
  }, [authUser, fetchProfile]);

  const login = async (data: ILoginData) => {
    const res = await loginAction(data);

    if (res.code === 200) {
      setAuthUser(res.data?.user);
    }
    return res;
  };

  const clearUserData = () => {
    setAuthUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessToken,
        isAuthenticated,
        login,
        authUser,
        clearUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthProvider };
