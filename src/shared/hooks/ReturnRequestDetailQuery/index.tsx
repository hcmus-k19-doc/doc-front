import { useQuery } from '@tanstack/react-query';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import returnRequestService from 'services/ReturnRequestService';

export const useReturnRequestDetailQuery = (
  processingDocumentType: ProcessingDocumentTypeEnum,
  id: number
) => {
  return useQuery({
    queryKey: ['QUERIES.RETURN_REQUEST_DETAIL', id],
    queryFn: () => returnRequestService.getReturnRequestById(processingDocumentType, id),
    retry: false,
  });
};
