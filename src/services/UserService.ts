import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { UserDto } from 'models/doc-main-models';

const getCurrentUser = () => {
  return axios.get<UserDto>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/current`);
};

const getDirectors = async () => {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/directors`);
  return res.data;
};

const userService = {
  getCurrentUser,
  getDirectors,
};

export default userService;
