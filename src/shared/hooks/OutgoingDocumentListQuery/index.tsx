import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { TableDataType, TableRowDataType } from 'pages/shared/OutgoingDocListPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { PAGE_SIZE } from 'shared/models/states';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import { PAGE_SIZE_MODAL } from '../../models/states';

import { DocQueryState } from './core/states';

const queryState = atom<DocQueryState>({
  key: 'OUT_DOC_QUERY_STATE',
  default: {
    page: 1,
    pageSize: PAGE_SIZE,
  },
});

export const useOutgoingDocReq = () => useRecoilState(queryState);

export const useOutgoingDocRes = (isModal: boolean) => {
  const { t } = useTranslation();
  const query = useRecoilValue<DocQueryState>(queryState);

  return useQuery({
    queryKey: ['QUERIES.OUTGOING_DOCUMENT_LIST', query],
    queryFn: () => {
      return outgoingDocumentService
        .getOutgoingDocuments(
          {
            releaseDateFrom: query.releaseDate?.[0].format(DAY_MONTH_YEAR_FORMAT),
            releaseDateTo: query.releaseDate?.[1].format(DAY_MONTH_YEAR_FORMAT),
            ...query,
          },
          query.page,
          isModal ? PAGE_SIZE_MODAL : query.pageSize
        )
        .then((data) => {
          const totalElements = data.totalElements;
          const rowsData: TableRowDataType[] = data.payload.map((item) => {
            return {
              ordinalNumber: (query.page - 1) * query.pageSize + data.payload.indexOf(item) + 1,
              name: item.name,
              key: item.id,
              id: item.id,
              type: item.documentTypeName,
              releaseNumber: item.outgoingNumber,
              originId: item.originalSymbolNumber,
              issuePlace: item.publishingDepartmentName,
              releaseDate: '',
              summary: item.summary,
              fullText: '',
              status: t(`PROCESSING_STATUS.${item.status}`),
              objType: 'OutgoingDocument',
              attachments: [],
              isDocTransferred: item.isDocTransferred,
              isDocCollaborator: item.isDocCollaborator,
              isTransferable: item.isTransferable,
              outgoingNumber: item.outgoingNumber,
              deadline: item.customProcessingDuration,
              isDocTransferredByNextUserInFlow: false,
              isLoading: false,
            };
          });

          const tableData: TableDataType = {
            page: query.page,
            pageSize: isModal ? PAGE_SIZE_MODAL : query.pageSize,
            totalElements: totalElements,
            payload: rowsData,
          };
          return tableData;
        });
    },
    retry: false,
  });
};
