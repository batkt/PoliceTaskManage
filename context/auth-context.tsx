'use client';

import { loginAction, LoginResponseType } from '@/actions/auth.action';
import { getUserProfile } from '@/actions/user.action';
import { CustomResponse } from '@/lib/http.utils';
import { User } from '@/lib/types/user.types';
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
  isLoggedIn: boolean;
  accessToken?: string;
  login: (data: ILoginData) => Promise<CustomResponse<LoginResponseType>>; // Optional login function
  authUser?: User;
  clearUserData: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isLoggedIn: false,
  accessToken: undefined,
  // login: () => {},
  login: () => Promise.reject({ message: '' }), // Default value for login function
  authUser: undefined,
  clearUserData: () => {},
});

interface IAAuthProviderProps {
  children: ReactNode;
  accessToken?: string;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children, accessToken }: IAAuthProviderProps) => {
  const [token, setToken] = useState(accessToken);
  const [authUser, setAuthUser] = useState<User | undefined>();

  const getUserProfileData = useCallback(async () => {
    if (token && !authUser) {
      const res = await getUserProfile();
      setAuthUser(res.data);
    }
  }, [token, authUser]);

  useEffect(() => {
    getUserProfileData();
  }, [getUserProfileData]);

  const login = async (data: ILoginData) => {
    const res = await loginAction(data);

    if (res.code === 200) {
      setToken(res.data.accessToken);
      setAuthUser(res.data?.user);
    }
    return res;
  };

  const clearUserData = () => {
    setAuthUser(undefined);
    setToken('');
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken: token,
        isLoggedIn: !!token, // Default value, can be updated with state management
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
