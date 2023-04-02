import React, { Dispatch, SetStateAction } from 'react';
import { UserDto } from 'models/doc-main-models';
import { TokenDto } from 'models/models';
import * as authUtils from 'utils/AuthUtils';

export const initAuthContextPropsState = {
  auth: authUtils.getAuth(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  saveAuth: () => {},
  currentUser: undefined,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
};

export interface AuthContextProps {
  auth: TokenDto | undefined;
  saveAuth: (auth: TokenDto | undefined) => void;
  currentUser: UserDto | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserDto | undefined>>;
  logout: () => void;
}

export interface Props {
  children: React.ReactNode;
}
