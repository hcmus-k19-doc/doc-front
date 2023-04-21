import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { DocSystemRoleEnum, UserDto } from 'models/doc-main-models';

const getCurrentUser = () => {
  return axios.get<UserDto>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/current`);
};

async function getUsersByRole(role: DocSystemRoleEnum) {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/role/${role}`);
  return res.data;
}

const userService = {
  getCurrentUser,
  getUsersByRole,
};

export default userService;
