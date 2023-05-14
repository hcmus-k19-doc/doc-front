import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import { DepartmentDto } from 'models/doc-main-models';
import {
  DepartmentTableDataType,
  DepartmentTableRowDataType,
} from 'pages/admin/DepartmentManagementPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import adminService from 'services/AdminService';
import { PaginationStateUtils } from 'shared/models/states';

import { useSweetAlert } from '../SwalAlert';

import { DocDepartmentQueryState } from './core/models';

const queryState = atom<DocDepartmentQueryState>({
  key: 'DOC_DEPARTMENT_QUERY_STATE',
  default: {
    ...PaginationStateUtils.defaultValue,
    searchCriteria: {
      departmentName: '',
    },
  },
});

const QUERY_PAGINATION_DEPARTMENTS = 'QUERY.PAGINATION.DEPARTMENTS';

export function useSelectionDepartmentRes() {
  return useQuery<DepartmentDto[]>({
    queryKey: ['QUERY.SELECTION.DEPARTMENT'],
    queryFn: async () => {
      return adminService.getSelectionDepartments();
    },
  });
}

export function usePaginationDepartments() {
  const query = useRecoilValue<DocDepartmentQueryState>(queryState);

  return useQuery<DepartmentTableDataType>({
    queryKey: [QUERY_PAGINATION_DEPARTMENTS, query],
    queryFn: async () => {
      const res = await adminService.searchDepartments(
        query.searchCriteria,
        query.page,
        query.pageSize
      );

      const totalElements = res.totalElements;
      const payload: DepartmentTableRowDataType[] = res.payload.map((item, index) => {
        return {
          key: item.id,
          id: item.id,
          createdBy: item.createdBy,
          order: index + 1,
          version: item.version,
          departmentName: item.departmentName,
          truongPhongFullName: item.truongPhong?.fullName || '',
          truongPhongId: item.truongPhong?.id as number,
          description: item.description,
        };
      });

      return {
        page: query.page,
        pageSize: query.pageSize,
        totalElements,
        payload,
      };
    },
  });
}

export const useDepartmentReq = () => useRecoilState(queryState);

export function useSaveDepartmentMutation() {
  const queryClient = useQueryClient();
  const sweetAlert = useSweetAlert();
  const query = useRecoilValue<DocDepartmentQueryState>(queryState);

  return useMutation({
    mutationKey: ['MUTATION.SAVE.DEPARTMENT'],
    mutationFn: async (payload: DepartmentTableRowDataType) => {
      const departmentDto: DepartmentDto = {
        id: payload.id,
        departmentName: payload.departmentName,
        version: payload.version,
        truongPhong: {
          id: payload.truongPhongId,
          fullName: payload.truongPhongFullName,
        },
        description: payload.description,
      };

      return await adminService.saveDepartment(departmentDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_PAGINATION_DEPARTMENTS, query]);
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e instanceof AxiosError) {
          sweetAlert({
            icon: 'error',
            html: t(e.response?.data.message),
            confirmButtonColor: PRIMARY_COLOR,
            confirmButtonText: 'OK',
            showConfirmButton: true,
          });
        } else {
          console.error(e);
        }
      }
    },
  });
}

export function useDeleteDepartmentsMutation() {
  const queryClient = useQueryClient();
  const sweetAlert = useSweetAlert();
  const query = useRecoilValue<DocDepartmentQueryState>(queryState);

  return useMutation({
    mutationKey: ['MUTATION.DELETE.DEPARTMENTS'],
    mutationFn: async (ids: number[]) => {
      return await adminService.deleteDepartmentsByIds(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_PAGINATION_DEPARTMENTS, query]);
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        sweetAlert({
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
