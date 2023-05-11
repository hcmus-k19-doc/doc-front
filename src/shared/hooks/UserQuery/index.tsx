import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import { UserDto } from 'models/doc-main-models';
import {
  UserTableDataType,
  UserTableRowDataType,
} from 'pages/admin/UserManagementPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import adminService from 'services/AdminService';
import { PaginationStateUtils } from 'shared/models/states';

import { DocQueryState } from '../IncomingDocumentListQuery/core/states';
import { useSweetAlert } from '../SwalAlert';

import { DocUserQueryState } from './core/states';

const queryState = atom<DocUserQueryState>({
  key: 'DOC_USER_QUERY_STATE',
  default: {
    ...PaginationStateUtils.defaultValue,
    userSearchCriteria: {
      username: '',
      email: '',
      fullName: '',
      role: undefined,
      departmentId: undefined,
    },
  },
});

export const useUserReq = () => useRecoilState(queryState);

export function useUserRes() {
  const query = useRecoilValue<DocUserQueryState>(queryState);

  return useQuery({
    queryKey: ['QUERIES.USER_LIST', query],
    queryFn: async () => {
      const res = await adminService.searchUsers(
        query.userSearchCriteria,
        query.page,
        query.pageSize
      );
      const totalElements = res.totalElements;
      const rowsData: UserTableRowDataType[] = res.payload.map((item, index) => {
        return {
          key: item.id,
          id: item.id,
          order: index + 1,
          version: item.version,
          username: item.username,
          email: item.email,
          fullName: item.fullName,
          role: item.role,
          translatedRole: t(`user.role.${item.role}`),
          department: item.department.departmentName,
          departmentId: item.department.id,
        };
      });

      return {
        page: query.page,
        pageSize: query.pageSize,
        totalElements,
        payload: rowsData,
      } as UserTableDataType;
    },
  });
}

export function useUserMutation() {
  const queryClient = useQueryClient();
  const query = useRecoilValue<DocQueryState>(queryState);
  const showAlert = useSweetAlert();

  return useMutation({
    mutationKey: ['MUTATION.USER'],
    mutationFn: async (user: UserTableRowDataType) => {
      const userDto: Partial<UserDto> = {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        version: user.version,
        department: {
          id: user.departmentId,
          departmentName: user.department,
          version: 0,
        },
      };
      if (user.id) {
        return await adminService.updateUser(userDto);
      } else {
        return await adminService.createUser(userDto);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['QUERIES.USER_LIST', query]);
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        showAlert({
          icon: 'error',
          html: t(e.response?.data.message),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } else {
        console.error(e);
      }
    },
  });
}

export function useUserDeleteMutation() {
  const queryClient = useQueryClient();
  const query = useRecoilValue<DocQueryState>(queryState);

  return useMutation({
    mutationKey: ['MUTATION.USER_DELETE'],
    mutationFn: async (ids: number[]) => {
      return await adminService.deleteUsers(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['QUERIES.USER_LIST', query]);
    },
  });
}
