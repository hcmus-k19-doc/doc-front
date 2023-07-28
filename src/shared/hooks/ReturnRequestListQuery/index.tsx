import { useQuery } from '@tanstack/react-query';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import returnRequestService from 'services/ReturnRequestService';

export function useReturnRequestRes(
  processingDocumentType: ProcessingDocumentTypeEnum,
  documentId: number
) {
  const { data } = useQuery({
    queryKey: ['QUERIES.RETURN_REQUEST'],
    queryFn: () => {
      return returnRequestService.getReturnRequests(processingDocumentType, documentId);
    },
    cacheTime: 0,
  });

  return data?.data;
}
