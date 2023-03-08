import axios from 'axios';
import { UserDto } from 'models/doc-main-models';

import { VITE_DOC_MAIN_SERVICE_URL } from '../config/constant';

export const getCurrentUser = () => {
  return axios.get<UserDto>(`${VITE_DOC_MAIN_SERVICE_URL}/users/current`);
};
