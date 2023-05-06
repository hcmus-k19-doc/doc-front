import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DepartmentDto,
  DocPaginationDto,
  UserDto,
  UserSearchCriteria,
} from 'models/doc-main-models';

const ADMIN_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/admin`;

async function searchUsers(
  searchCriteria: Partial<UserSearchCriteria>,
  page: number,
  pageSize: number
) {
  const { data } = await axios.post<DocPaginationDto<UserDto>>(
    `${ADMIN_URL}/search/users`,
    searchCriteria,
    {
      params: {
        page: page - 1,
        pageSize,
      },
    }
  );
  return data;
}

async function getDepartments() {
  const { data } = await axios.get<DepartmentDto[]>(`${ADMIN_URL}/selection/departments`);
  return data;
}

async function createUser(user: Partial<UserDto>) {
  const { data } = await axios.post<number>(`${ADMIN_URL}/users`, user);
  return data;
}

async function updateUser(user: Partial<UserDto>) {
  console.log(user);
  const { data } = await axios.put<number>(`${ADMIN_URL}/users/${user.id}`, user);
  return data;
}

async function deleteUsers(userIds: number[]) {
  await axios.delete(`${ADMIN_URL}/users`, { data: userIds });
}

const AdminService = {
  searchUsers,
  getDepartments,
  createUser,
  updateUser,
  deleteUsers,
};

export default AdminService;
