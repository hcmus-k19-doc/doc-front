import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocStatisticsSearchCriteriaDto,
  DocStatisticsWrapperDto,
  DocSystemRoleEnum,
  TransferHistorySearchCriteriaDto,
  UserDepartmentDto,
  UserDto,
} from 'models/doc-main-models';
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

async function getTransferHistory(
  searchCriteria: Partial<TransferHistorySearchCriteriaDto>,
  page: number,
  pageSize: number
) {
  return await axios
    .post(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/get-transfer-history`, searchCriteria, {
      params: {
        page: page - 1,
        pageSize: pageSize,
      },
    })
    .then((response) => response.data);
}

async function getUnreadNotificationCount() {
  const res = await axios.get<number>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/users/get-transfer-history/quantity`
  );
  return res.data;
}

async function updateNotificationStatus(transferHistoryId: number) {
  await axios.put(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/users/update-transfer-history-is-read/${transferHistoryId}`
  );
}
async function updateAllNotificationStatus() {
  await axios.put(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/update-transfer-history-is-read`);
}

async function getAllUsers() {
  const res = await axios.get<UserDto[]>(`${REACT_APP_DOC_MAIN_SERVICE_URL}/users/all`);
  return res.data;
}

async function getStatistics(
  docStatisticsSearchCriteriaDto: Partial<DocStatisticsSearchCriteriaDto>
): Promise<DocStatisticsWrapperDto> {
  return await axios
    .post<DocStatisticsWrapperDto>(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/users/get-statistics`,
      docStatisticsSearchCriteriaDto
    )
    .then((response) => response.data);
}

const userService = {
  getCurrentUser,
  getUsersByRole,
  getUsersByRoleWithDepartment,
  updatePassword,
  getTransferHistory,
  getUnreadNotificationCount,
  updateNotificationStatus,
  updateAllNotificationStatus,
  getAllUsers,
  getStatistics,
};

export default userService;
