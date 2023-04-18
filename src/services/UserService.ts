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

const getSecretaries = async () => {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/secretaries`);
  return res.data;
};

const getExperts = async () => {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/experts`);
  return res.data;
};

const getManagers = async () => {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/managers`);
  return res.data;
};

const userService = {
  getCurrentUser,
  getDirectors,
  getSecretaries,
  getExperts,
  getManagers,
};

export default userService;
