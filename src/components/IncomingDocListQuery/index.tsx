import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { format } from 'date-fns';
import { atom, useRecoilValue } from 'recoil';

import { DocQueryState } from '../../models/models';
import {
  PAGE_SIZE,
  TableDataType,
  TableRowDataType,
} from '../../pages/ChuyenVien/CVDocInList/models';
import { getIncomingDocuments } from '../../services/IncomingDocumentService';

export const queryState = atom<DocQueryState>({
  key: 'DOC_QUERY_STATE',
  default: {
    page: 1,
    incomingNumber: '',
  },
});

export const useQueryResponse = () => {
  const { t } = useTranslation();
  const query = useRecoilValue<DocQueryState>(queryState);

  return useQuery(`QUERIES.INCOMING_DOCUMENT_LIST-${query.page}-${PAGE_SIZE}`, () => {
    return getIncomingDocuments('', query.page || 1).then((data) => {
      const totalElements = data.totalElements;
      const rowsData: TableRowDataType[] = data.payload.map((item) => {
        return {
          key: item.id,
          id: item.id,
          issueLevel: t(`SENDING_LEVEL.${item.sendingLevel.level}`),
          type: t(`DOCUMENT_TYPE.${item.documentType.type}`),
          arriveId: item.incomingNumber,
          originId: item.originalSymbolNumber,
          arriveDate: format(new Date(item.arrivingDate), 'dd-MM-yyyy'),
          issuePlace: item.distributionOrg.name,
          summary: item.summary,
          fullText: '',
          status: 'HEHE',
          deadline: 'HUHU',
        };
      });

      const tableData: TableDataType = {
        page: query.page || 1,
        totalElements: totalElements,
        payload: rowsData,
      };
      return tableData;
    });
  });
};
