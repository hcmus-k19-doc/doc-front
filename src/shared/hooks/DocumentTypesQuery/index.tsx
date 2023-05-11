import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import {
  DocumentTypeTableDataType,
  DocumentTypeTableRowDataType,
} from 'pages/admin/DocumentTypeManagementPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import adminService from 'services/AdminService';
import documentTypeService from 'services/DocumentTypeService';
import { PaginationStateUtils } from 'shared/models/states';

import { PRIMARY_COLOR } from '../../../config/constant';
import { DocumentTypeDto } from '../../../models/doc-main-models';
import { DocQueryState } from '../IncomingDocumentListQuery/core/states';
import { useSweetAlert } from '../SwalAlert';

import { DocDocumentTypeQueryState } from './core/states';

const queryState = atom<DocDocumentTypeQueryState>({
  key: 'DOC_DOCUMENT_TYPE_QUERY_STATE',
  default: {
    ...PaginationStateUtils.defaultValue,
    searchCriteria: {
      type: '',
    },
  },
});

export function useDocumentTypesRes() {
  return useQuery({
    queryKey: ['QUERIES.DOCUMENT_TYPES'],
    queryFn: async () => {
      const { data } = await documentTypeService.getDocumentTypes();
      return data;
    },
  });
}

export function usePaginationDocumentTypesRes() {
  const query = useRecoilValue<DocDocumentTypeQueryState>(queryState);

  return useQuery<DocumentTypeTableDataType>({
    queryKey: ['QUERIES.DOCUMENT_TYPES', query],
    queryFn: async () => {
      const res = await adminService.searchDocumentTypes(
        query.searchCriteria,
        query.page,
        query.pageSize
      );
      const totalElements = res.totalElements;
      const payload: DocumentTypeTableRowDataType[] = res.payload.map((item, index) => {
        return {
          key: item.id,
          id: item.id,
          order: index + 1,
          version: item.version,
          type: item.type,
          translatedType: t(`document_type.${item.type}`),
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

export const useDocumentTypesReq = () => useRecoilState(queryState);

export function useDocumentTypeMutation() {
  const queryClient = useQueryClient();
  const sweetAlert = useSweetAlert();
  const query = useRecoilValue<DocDocumentTypeQueryState>(queryState);

  return useMutation({
    mutationKey: ['MUTATION.DOCUMENT_TYPE'],
    mutationFn: async (payload: DocumentTypeTableRowDataType) => {
      const documentTypeDto: DocumentTypeDto = {
        id: payload.id,
        version: payload.version,
        type: payload.type,
      };

      return await adminService.saveDocumentType(documentTypeDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['QUERIES.DOCUMENT_TYPES', query]);
    },
    onError: (e) => {
      if (e instanceof AxiosError) {
        if (e instanceof AxiosError) {
          sweetAlert({
            icon: 'error',
            html: t(e.response?.data.message),
            confirmButtonColor: PRIMARY_COLOR,
            confirmButtonText: 'OK',
          });
        } else {
          console.error(e);
        }
      }
    },
  });
}

export function useDocumentTypeDeleteMutation() {
  const queryClient = useQueryClient();
  const query = useRecoilValue<DocQueryState>(queryState);

  return useMutation({
    mutationKey: ['MUTATION.DOCUMENT_TYPE_DELETE'],
    mutationFn: async (ids: number[]) => {
      return await adminService.deleteDocumentTypeByIds(ids);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['QUERIES.DOCUMENT_TYPES', query]);
    },
  });
}
