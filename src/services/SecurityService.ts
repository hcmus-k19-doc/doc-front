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

const securityService = {
  login,
  logout,
};

export default securityService;
