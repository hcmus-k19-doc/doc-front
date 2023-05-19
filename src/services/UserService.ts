import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { DocSystemRoleEnum, UserDepartmentDto, UserDto } from 'models/doc-main-models';
import qs from 'qs';

const getCurrentUser = () => {
  return axios.get<UserDto>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/current`);
};

async function getUsersByRole(role: DocSystemRoleEnum) {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/role/${role}`);
  return res.data;
}

async function getUsersByRoleWithDepartment(role: DocSystemRoleEnum) {
  const res = await axios.get<UserDepartmentDto[]>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/users/role/department/${role}`
  );
  return res.data;
}

async function updatePassword(oldPassword: string, confirmPassword: string, newPassword: string) {
  if (oldPassword !== confirmPassword) {
    throw new Error('user.detail.password_not_match');
  } else {
    await axios.put(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/users/current/password`,
      qs.stringify({
        oldPassword,
        newPassword,
      })
    );
  }
}

const userService = {
  getCurrentUser,
  getUsersByRole,
  getUsersByRoleWithDepartment,
  updatePassword,
};

export default userService;
