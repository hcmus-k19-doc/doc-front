import { useQuery } from '@tanstack/react-query';
import IncomingDocumentService from 'services/IncomingDocumentService';

const getIncomingDocuments = async (id: number) => {
  const response = await IncomingDocumentService.getIncomingDocumentById(id);
  return response.data;
};

export const useIncomingDocumentDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['QUERIES.INCOMING_DOCUMENT_DETAIL', id],
    queryFn: () => getIncomingDocuments(id),
  });
};
