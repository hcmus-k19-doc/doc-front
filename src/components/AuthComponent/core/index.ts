/* eslint-disable @typescript-eslint/no-empty-function */
import React, { Dispatch, SetStateAction } from 'react';
import { UserDto } from 'models/doc-main-models';
import { TokenDto } from 'models/models';
import * as authUtils from 'utils/AuthUtils';

export const initAuthContextPropsState = {
  auth: authUtils.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
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
