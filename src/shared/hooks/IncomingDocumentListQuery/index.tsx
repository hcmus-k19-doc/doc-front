import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { TableDataType, TableRowDataType } from 'pages/shared/IncomingDocListPage/core/models';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import incomingDocumentService from 'services/IncomingDocumentService';
import { PAGE_SIZE } from 'shared/models/states';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import { PAGE_SIZE_MODAL } from '../../models/states';

import { IncomingDocQueryState } from './core/states';

const queryState = atom<IncomingDocQueryState>({
  key: 'DOC_QUERY_STATE',
  default: {
    page: 1,
    pageSize: PAGE_SIZE,
  },
});

export const useIncomingDocReq = () => useRecoilState(queryState);

export const useIncomingDocRes = (isModal: boolean) => {
  const { t } = useTranslation();
  const query = useRecoilValue<IncomingDocQueryState>(queryState);

  return useQuery({
    queryKey: ['QUERIES.INCOMING_DOCUMENT_LIST', query],
    queryFn: () => {
      return incomingDocumentService
        .getIncomingDocuments(
          {
            arrivingDateFrom: query.arrivingDate?.[0].format(DAY_MONTH_YEAR_FORMAT),
            arrivingDateTo: query.arrivingDate?.[1].format(DAY_MONTH_YEAR_FORMAT),
            processingDurationFrom: query.processingDuration?.[0].format(DAY_MONTH_YEAR_FORMAT),
            processingDurationTo: query.processingDuration?.[1].format(DAY_MONTH_YEAR_FORMAT),
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
              issueLevel: t(`SENDING_LEVEL.${item?.sendingLevel?.level}`),
              type: item.documentType.type,
              arriveId: item.incomingNumber,
              originId: item.originalSymbolNumber,
              arriveDate: format(new Date(item.arrivingDate), 'dd-MM-yyyy'),
              issuePlace: item.distributionOrg.name,
              summary: item.summary,
              fullText: '',
              status: t(`PROCESSING_STATUS.${item.status}`),
              deadline: item.customProcessingDuration,
              attachments: item.attachments,
              incomingNumber: item.incomingNumber,
              isDocTransferred: item.isDocTransferred,
              isDocCollaborator: item.isDocCollaborator,
              isTransferable: item.isTransferable,
              isDocTransferredByNextUserInFlow: item.isDocTransferredByNextUserInFlow,
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
