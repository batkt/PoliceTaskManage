'use client';

// import { loginAction, LoginResponseType } from '@/actions/auth.action';
// import { getUserProfile } from '@/actions/user.action';
import { useToast } from '@/hooks/use-toast';
import {
  checkAuth,
  LoginResponseType,
  login as loginAction,
} from '@/lib/service/auth';
import { CustomResponse } from '@/lib/types/global.types';
import { User } from '@/lib/types/user.types';
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
  login: (data: ILoginData) => Promise<CustomResponse<LoginResponseType>>; // Optional login function
  authUser?: User;
  clearUserData: () => void;
}

const AuthContext = createContext<IAuthContext>({
  isAuthenticated: false,
  accessToken: undefined,
  // login: () => {},
  login: () => Promise.reject({ message: '' }), // Default value for login function
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
  // const [token, setToken] = useState(accessToken);
  // const { toast } = useToast();
  const [authUser, setAuthUser] = useState<User | undefined>();
  // const [loading, setLoading] = useState(true);
  // const [isAuthenticated, setIsAuthenticated] = useState(true);
  // const router = useRouter();

  // const getUserProfileData = useCallback(async () => {
  //   if (token && !authUser) {
  //     const res = await getUserProfile();
  //     setAuthUser(res.data);
  //   }
  // }, [token, authUser]);

  // useEffect(() => {
  //   getUserProfileData();
  // }, [getUserProfileData]);

  // useEffect(() => {
  //   const verifyAuth = async () => {
  //     try {
  //       const _isAuthenticated = await checkAuth();
  //       console.log('check res', _isAuthenticated);
  //       setIsAuthenticated(_isAuthenticated);
  //       if (!_isAuthenticated) {
  //         console.log('wtf');
  //         router.push('/');
  //         setLoading(false);
  //       } else {
  //         setLoading(false);
  //       }
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //       console.log(error);
  //       // router.push('/login');
  //     }
  //   };

  //   verifyAuth();
  // }, [router, toast]);

  // console.log(loading);
  // if (loading) {
  //   return (
  //     <div className="container flex items-center justify-center min-h-screen">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

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
        isAuthenticated, // Default value, can be updated with state management
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
