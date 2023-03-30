import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { UserDto } from 'models/doc-main-models';
import { TokenDto } from 'models/models';
import userService from 'services/UserService';
import * as authUtils from 'utils/AuthUtils';

const initAuthContextPropsState = {
  auth: authUtils.getAuth(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  saveAuth: () => {},
  currentUser: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
};

type AuthContextProps = {
  auth: TokenDto | undefined;
  saveAuth: (auth: TokenDto | undefined) => void;
  currentUser: UserDto | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserDto | undefined>>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface Props {
  children: React.ReactNode;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [auth, setAuth] = useState<TokenDto | undefined>(authUtils.getAuth());
  const [currentUser, setCurrentUser] = useState<UserDto | undefined>();
  const saveAuth = (auth: TokenDto | undefined) => {
    setAuth(auth);
    if (auth) {
      authUtils.setAuth(auth);
    } else {
      authUtils.removeAuth();
    }
  };
  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthInit: React.FC<Props> = ({ children }) => {
  const { auth, logout, setCurrentUser } = useAuth();

  const didRequest = useRef(false);

  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const { data } = await userService.getCurrentUser();
          if (data) {
            setCurrentUser(data);
          }
        }
      } catch (error) {
        console.error(error);
        if (!didRequest.current) {
          logout();
        }
      } finally {
        setShowSplashScreen(false);
      }

      return () => (didRequest.current = true);
    };

    if (auth && auth.access_token) {
      requestUser();
    } else {
      logout();
      setShowSplashScreen(false);
    }
  }, []);

  return showSplashScreen ? (
    <div className='flex justify-center'>
      <LoadingOutlined style={{ fontSize: 150 }} spin />
    </div>
  ) : (
    <>{children}</>
  );
};
