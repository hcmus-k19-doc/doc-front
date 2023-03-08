import axios from 'axios';
import qs from 'qs';

import { REACT_APP_DOC_MAIN_SERVICE_URL } from '../config/constant';
import { TokenDto } from '../models/models';

export const getToken = (username: string, password: string) => {
  return axios.post<TokenDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/security/auth/token`,
    qs.stringify({
      username,
      password,
    })
  );
};
