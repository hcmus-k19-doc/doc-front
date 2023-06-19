import { useQuery } from '@tanstack/react-query';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import incomingDocumentService from 'services/IncomingDocumentService';

import { PAGE_SIZE } from '../../models/states';

import { StatisticsQueryState } from './core/states';

const QUERY_STATISTICS = 'QUERY.STATISTICS';

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
    queryFn: async () => incomingDocumentService.getStatistics(),
  });
}
