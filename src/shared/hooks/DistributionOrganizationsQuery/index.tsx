import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import { PRIMARY_COLOR } from '../../../config/constant';
import { DistributionOrganizationDto } from '../../../models/doc-main-models';
import {
  DistributionOrganizationTableDataType,
  DistributionOrganizationTableRowDataType,
} from '../../../pages/admin/DistributionOrganizationManagementPage/core/models';
import adminService from '../../../services/AdminService';
import { PaginationStateUtils } from '../../models/states';
import { useSweetAlert } from '../SwalAlert';

import { DocDistributionOrganizationQueryState } from './core/models';

const queryState = atom<DocDistributionOrganizationQueryState>({
  key: 'DOC_DEPARTMENT_QUERY_STATE',
  default: {
    ...PaginationStateUtils.defaultValue,
    searchCriteria: {
      name: '',
    },
  },
});

const QUERY_PAGINATION_DISTRIBUTION_ORGANIZATIONS = 'QUERY.PAGINATION.DISTRIBUTION_ORGANIZATIONS';

export function usePaginationDistributionOrganizations() {
  const query = useRecoilValue<DocDistributionOrganizationQueryState>(queryState);

  return useQuery<DistributionOrganizationTableDataType>({
    queryKey: [QUERY_PAGINATION_DISTRIBUTION_ORGANIZATIONS, query],
    queryFn: async () => {
      const res = await adminService.searchDistributionOrganizations(
        query.searchCriteria,
        query.page,
        query.pageSize
      );

      const totalElements = res.totalElements;
      const payload: DistributionOrganizationTableRowDataType[] = res.payload.map((item, index) => {
        return {
          key: item.id,
          id: item.id,
          createdBy: item.createdBy,
          order: index + 1,
          version: item.version,
          name: item.name,
          symbol: item.symbol,
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

export const useDistributionOrganizationReq = () => useRecoilState(queryState);

export function useSaveDistributionOrganizationMutation() {
  const queryClient = useQueryClient();
  const sweetAlert = useSweetAlert();
  const query = useRecoilValue<DocDistributionOrganizationQueryState>(queryState);

  return useMutation({
    mutationKey: ['MUTATION.SAVE.DISTRIBUTION_ORGANIZATIONS'],
    mutationFn: async (payload: DistributionOrganizationTableRowDataType) => {
      const distributionOrganizationDto: DistributionOrganizationDto = {
        id: payload.id,
        name: payload.name,
        version: payload.version,
        symbol: payload.symbol,
      };

      return await adminService.saveDistributionOrganization(distributionOrganizationDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_PAGINATION_DISTRIBUTION_ORGANIZATIONS, query]);
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
