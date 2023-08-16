import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DepartmentDto,
  DepartmentSearchCriteria,
  DistributionOrganizationDto,
  DistributionOrganizationSearchCriteria,
  DocPaginationDto,
  DocumentTypeDto,
  DocumentTypeSearchCriteria,
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

async function getSelectionDepartments() {
  const { data } = await axios.get<DepartmentDto[]>(`${ADMIN_URL}/selection/departments`);
  return data;
}

async function searchDepartments(
  searchCriteria: Partial<DepartmentSearchCriteria>,
  page: number,
  pageSize: number
) {
  const { data } = await axios.post<DocPaginationDto<DepartmentDto>>(
    `${ADMIN_URL}/search/departments`,
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

async function saveDepartment(department: Partial<DepartmentDto>) {
  const { data } = await axios.post<number>(`${ADMIN_URL}/departments`, department);
  return data;
}

async function deleteDepartmentsByIds(departmentIds: number[]) {
  await axios.delete(`${ADMIN_URL}/departments`, { data: departmentIds });
}

async function createUser(user: Partial<UserDto>) {
  const { data } = await axios.post<number>(`${ADMIN_URL}/users`, user);
  return data;
}

async function updateUser(user: Partial<UserDto>) {
  const { data } = await axios.put<number>(`${ADMIN_URL}/users/${user.id}`, user);
  return data;
}

async function resetUserPassword(userId: number) {
  await axios.get(`${ADMIN_URL}/users/reset-password/${userId}`);
}

async function deleteUsers(userIds: number[]) {
  await axios.delete(`${ADMIN_URL}/users`, { data: userIds });
}

async function searchDocumentTypes(
  searchCriteria: Partial<DocumentTypeSearchCriteria>,
  page: number,
  pageSize: number
) {
  const { data } = await axios.post<DocPaginationDto<DocumentTypeDto>>(
    `${ADMIN_URL}/search/document-types`,
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

async function saveDocumentType(documentTypeDto: DocumentTypeDto) {
  const { data } = await axios.post<number>(`${ADMIN_URL}/document-types`, documentTypeDto);
  return data;
}

async function deleteDocumentTypeByIds(ids: number[]) {
  await axios.delete(`${ADMIN_URL}/document-types`, { data: ids });
}

async function isUserAlreadyTruongPhongOfAnotherDepartment(userId: number, departmentId: number) {
  const { data } = await axios.get<boolean>(
    `${ADMIN_URL}/already-assigned/truong-phong/${userId}/departments/${departmentId}`
  );
  return data;
}

async function searchDistributionOrganizations(
  searchCriteria: Partial<DistributionOrganizationSearchCriteria>,
  page: number,
  pageSize: number
) {
  const { data } = await axios.post<DocPaginationDto<DistributionOrganizationDto>>(
    `${ADMIN_URL}/search/distribution-organizations`,
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

async function saveDistributionOrganization(
  distributionOrganization: Partial<DistributionOrganizationDto>
) {
  const { data } = await axios.post<number>(
    `${ADMIN_URL}/distribution-organizations`,
    distributionOrganization
  );
  return data;
}

const AdminService = {
  searchUsers,
  getSelectionDepartments,
  searchDepartments,
  saveDepartment,
  createUser,
  updateUser,
  deleteUsers,
  searchDocumentTypes,
  saveDocumentType,
  deleteDocumentTypeByIds,
  deleteDepartmentsByIds,
  isUserAlreadyTruongPhongOfAnotherDepartment,
  resetUserPassword,
  searchDistributionOrganizations,
  saveDistributionOrganization,
};

export default AdminService;
