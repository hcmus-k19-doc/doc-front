import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { TokenDto } from 'models/models';
import qs from 'qs';

const login = (username: string, password: string) => {
  return axios.post<TokenDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/security/auth/token`,
    qs.stringify({
      username,
      password,
    })
  );
};

const logout = (refreshToken: string | undefined) => {
  return axios.post(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/security/auth/token/revoke`,
    qs.stringify({
      refreshToken,
    })
  );
};

const forgotPassword = (email: string) => {
  return axios.post<number>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/security/auth/forgot-password`,
    qs.stringify({
      email,
    })
  );
};

async function updatePassword(
  username: string,
  oldPassword: string,
  confirmPassword: string,
  newPassword: string
) {
  if (newPassword !== confirmPassword) {
    throw new Error('user.detail.password_not_match');
  } else if (oldPassword === newPassword) {
    throw new Error('user.detail.password_not_change');
  } else {
    await axios.put(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/security/auth/change-password`,
      qs.stringify({
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      })
    );
  }
}

const securityService = {
  login,
  logout,
  forgotPassword,
  updatePassword,
};

export default securityService;
