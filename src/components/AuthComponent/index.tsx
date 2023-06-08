import React, { createContext, FC, useContext, useEffect, useRef, useState } from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { UserDto } from 'models/doc-main-models';
import { TokenDto } from 'models/models';
import userService from 'services/UserService';
import * as authUtils from 'utils/AuthUtils';

import { AuthContextProps, initAuthContextPropsState, Props } from './core';

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

export const useAuth = () => {
  return useContext(AuthContext);
};

TopBarProgress.config({
  barColors: {
    '0': '#324AB2',
  },
});

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

  const logout = async () => {
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
      <TopBarProgress />
    </div>
  ) : (
    <>{children}</>
  );
};
