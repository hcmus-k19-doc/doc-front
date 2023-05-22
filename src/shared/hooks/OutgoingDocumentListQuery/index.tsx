import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { TableDataType, TableRowDataType } from 'pages/shared/OutgoingDocListPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { PAGE_SIZE } from 'shared/models/states';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import { DocQueryState } from './core/states';

const queryState = atom<DocQueryState>({
  key: 'OUT_DOC_QUERY_STATE',
  default: {
    page: 1,
    pageSize: PAGE_SIZE,
  },
});

export const useOutgoingDocReq = () => useRecoilState(queryState);

export const useOutgoingDocRes = () => {
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
          query.pageSize
        )
        .then((data) => {
          const totalElements = data.totalElements;
          const rowsData: TableRowDataType[] = data.payload.map((item) => {
            return {
              key: item.id,
              id: item.id,
              type: item.documentType.type,
              releaseNumber: item.outgoingNumber,
              originId: item.originalSymbolNumber,
              releaseDate: format(new Date(item.releaseDate), 'dd-MM-yyyy'),
              issuePlace: item.publishingDepartment.departmentName,
              summary: item.summary,
              fullText: '',
              status: t(`PROCESSING_STATUS.${item.status}`),
              objType: 'OutgoingDocument',
            };
          });

          const tableData: TableDataType = {
            page: query.page,
            pageSize: query.pageSize,
            totalElements: totalElements,
            payload: rowsData,
          };
          return tableData;
        });
    },
  });
};
