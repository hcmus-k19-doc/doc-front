import { useQuery } from '@tanstack/react-query';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import incomingDocumentService from 'services/IncomingDocumentService';

import { TableRowDataType } from '../../../pages/shared/StatisticsPage/core/models';
import userService from '../../../services/UserService';
import { DAY_MONTH_YEAR_FORMAT } from '../../../utils/DateTimeUtils';
import { PAGE_SIZE } from '../../models/states';

import { StatisticsQueryState } from './core/states';

const QUERY_STATISTICS = 'QUERY.STATISTICS';
const QUERY_CHART_STATISTICS = 'QUERY.CHART_STATISTICS';

const queryState = atom<StatisticsQueryState>({
  key: 'STATISTICS_QUERY_STATE',
  default: {
    page: 1,
    pageSize: PAGE_SIZE,
  },
});

export const useStatisticsReq = () => useRecoilState(queryState);

export function useStatisticsRes() {
  const query = useRecoilValue<StatisticsQueryState>(queryState);

  return useQuery({
    queryKey: [QUERY_STATISTICS, query],
    queryFn: async () => {
      return await userService
        .getStatistics({
          fromDate: query.statisticDate?.[0].format(DAY_MONTH_YEAR_FORMAT),
          toDate: query.statisticDate?.[1].format(DAY_MONTH_YEAR_FORMAT),
          ...query,
        })
        .then((data) => {
          const rowsData: TableRowDataType[] = data.map((item) => {
            return {
              ordinalNumber: data.indexOf(item) + 1,
              key: data.indexOf(item) + 1,
              expertName: item.userName,
              onTime: item.numberOfProcessedDocumentOnTime,
              overdueClosedDoc: item.numberOfProcessedDocumentOverdue,
              totalClosedDoc:
                item.numberOfProcessedDocumentOnTime + item.numberOfProcessedDocumentOverdue,
              unexpired: item.numberOfUnprocessedDocumentUnexpired,
              overdueUnprocessedDoc: item.numberOfUnprocessedDocumentOverdue,
              totalUnprocessedDoc:
                item.numberOfUnprocessedDocumentUnexpired + item.numberOfUnprocessedDocumentOverdue,
              onTimeProcessingPercentage:
                item.numberOfProcessedDocumentOnTime +
                  item.numberOfProcessedDocumentOverdue +
                  item.numberOfUnprocessedDocumentUnexpired +
                  item.numberOfUnprocessedDocumentOverdue ===
                0
                  ? 0
                  : (
                      (item.numberOfProcessedDocumentOnTime /
                        (item.numberOfProcessedDocumentOnTime +
                          item.numberOfProcessedDocumentOverdue +
                          item.numberOfUnprocessedDocumentUnexpired +
                          item.numberOfUnprocessedDocumentOverdue)) *
                      100
                    ).toFixed(2),
            };
          });
          return {
            rowsData,
          };
        });
    },
    retry: false,
  });
}

export function useChartStatisticsRes() {
  return useQuery({
    queryKey: [QUERY_CHART_STATISTICS],
    queryFn: async () => incomingDocumentService.getStatistics(),
  });
}
