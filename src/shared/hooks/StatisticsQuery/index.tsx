import { useQuery } from '@tanstack/react-query';
import incomingDocumentService from 'services/IncomingDocumentService';

const QUERY_STATISTICS = 'QUERY.STATISTICS';

export function useStatisticsRes() {
  return useQuery({
    queryKey: [QUERY_STATISTICS],
    queryFn: async () => incomingDocumentService.getStatistics(),
  });
}
