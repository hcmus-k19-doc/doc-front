import { useQuery } from '@tanstack/react-query';
import { SelectProps } from 'antd';

import processingMethodService from '../../../services/ProcessingMethodService';

export function useProcessingMethodRes() {
  const { data } = useQuery({
    queryKey: ['QUERIES.PROCESSING_METHOD'],
    queryFn: () => {
      return processingMethodService.getProcessingMethods();
    },
    cacheTime: 0,
  });

  const processingMethods = data?.data.map((processingMethods) => ({
    value: processingMethods.name,
  }));

  return {
    processingMethods,
  };
}
