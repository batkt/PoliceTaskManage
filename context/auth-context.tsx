'use client';

import { getUserData } from '@/lib/service/user';
import { CustomResponse } from '@/lib/types/global.types';
import { AuthUser } from '@/lib/types/user.types';
import { LoginResponseType, loginAction } from '@/ssr/actions/auth';

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

enum AuthStatus {
  UNKNOWN = "unknown",
  AUTHENTICATED = "authenticated",
  UNAUTHENTICATED = "unauthenticated",
}
interface IAuthContext {
  isAuthenticated: boolean;
  authStatus: AuthStatus;
  accessToken?: string;
  login: (data: ILoginData) => Promise<CustomResponse<LoginResponseType>>;
  authUser?: AuthUser;
  clearUserData: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  authStatus: AuthStatus.UNKNOWN,
  accessToken: undefined,
  login: () => Promise.reject({ message: '' }),
  authUser: undefined,
  clearUserData: () => { },
});

interface IAAuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({
  children,
}: IAAuthProviderProps) => {
  const [loggedUser, setLoggedUser] = useState<AuthUser | undefined>(undefined)
  const [authStatus, setAuthStatus] = useState<AuthStatus>(AuthStatus.UNKNOWN)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)

  const fetchProfile = useCallback(async () => {
    if (authStatus === AuthStatus.UNKNOWN) {
      const res = await getUserData();

      if (res.isOk) {
        setLoggedUser(res.data?.user);
        setAuthStatus(AuthStatus.AUTHENTICATED);
        setAccessToken(res.data?.accessToken);
      } else {
        setAuthStatus(AuthStatus.UNAUTHENTICATED);
        if (window.location.pathname !== "/")
          window.location.href = '/';
      }
    }
  }, []);

  useEffect(() => {
    fetchProfile();

  }, [fetchProfile]);

  const login = async (data: ILoginData) => {
    const res = await loginAction(data);

    if (res.isOk) {
      setLoggedUser(res.data?.user);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      setAccessToken(res.data?.accessToken);
    }
    return res;
  };

  const clearUserData = () => {
    setLoggedUser(undefined);
  };

  if (authStatus === AuthStatus.UNKNOWN) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessToken,
        isAuthenticated: false,
        authStatus,
        login,
        authUser: loggedUser,
        clearUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
export { AuthProvider };
