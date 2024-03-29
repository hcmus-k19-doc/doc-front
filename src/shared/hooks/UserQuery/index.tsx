import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SelectProps } from 'antd';
import { AxiosError } from 'axios';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import { DocSystemRoleEnum, TruongPhongDto, UserDto } from 'models/doc-main-models';
import {
  UserTableDataType,
  UserTableRowDataType,
} from 'pages/admin/UserManagementPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import adminService from 'services/AdminService';
import userService from 'services/UserService';
import { PaginationStateUtils } from 'shared/models/states';

import { IncomingDocQueryState } from '../IncomingDocumentListQuery/core/states';
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

const QUERY_USER_ROLE = 'QUERY.USER.ROLE';

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
          roleTitle: item.roleTitle,
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

export function useTruongPhongs() {
  return useQuery<TruongPhongDto[]>({
    queryKey: [QUERY_USER_ROLE],
    queryFn: async () => {
      const res = await userService.getUsersByRole(DocSystemRoleEnum.TRUONG_PHONG);
      const truongPhongs: TruongPhongDto[] = res.map((item) => ({
        id: item.id,
        fullName: item.fullName,
      }));

      return truongPhongs;
    },
  });
}

export function useUserMutation() {
  const queryClient = useQueryClient();
  const query = useRecoilValue<IncomingDocQueryState>(queryState);
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
        roleTitle: user.roleTitle,
        version: user.version,
        department: {
          id: user.departmentId,
          departmentName: user.department,
          description: '',
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
          showConfirmButton: true,
        });
      } else {
        console.error(e);
      }
    },
  });
}

export function useUserDeleteMutation() {
  const queryClient = useQueryClient();
  const query = useRecoilValue<IncomingDocQueryState>(queryState);

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

export function useAllUsers() {
  const { data } = useQuery({
    queryKey: ['QUERIES.ALL_USERS'],
    queryFn: async () => {
      return await userService.getAllUsers();
    },
  });

  // const allUsers: SelectProps['options'] = data?.map((user) => ({
  //   value: user.id,
  //   label: user.fullName + ' - ' + user.department.departmentName,
  // }));

  // const allUsers = data?.reduce((options, user) => {
  //   const departmentIndex = options.findIndex(
  //     (option) => option.label === user.department.departmentName
  //   );
  //
  //   if (departmentIndex !== -1) {
  //     options[departmentIndex].options.push({
  //       value: user.id,
  //       label: user.fullName,
  //     });
  //   } else {
  //     options.push({
  //       label: user.department.departmentName,
  //       options: [
  //         {
  //           value: user.id,
  //           label: user.fullName,
  //         },
  //       ],
  //     });
  //   }
  //
  //   return options;
  // }, []);

  const allUsers: SelectProps['options'] = [];

  data?.forEach((user) => {
    const departmentIndex = allUsers.findIndex(
      (option) => option.label === user.department.departmentName
    );

    if (departmentIndex !== -1) {
      allUsers[departmentIndex].options.push({
        value: user.id,
        label: user.fullName,
      });
    } else {
      allUsers.push({
        label: user.department.departmentName,
        options: [
          {
            value: user.id,
            label: user.fullName,
          },
        ],
      });
    }
  });

  return {
    allUsers,
    data,
  };
}
