import { useQuery } from '@tanstack/react-query';
import OutgoingDocumentService from 'services/OutgoingDocumentService';

const getOutgoingDocuments = async (id: number) => {
  const response = await OutgoingDocumentService.getOutgoingDocumentById(id);
  return response;
};

export const useOutgoingDocumentDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ['QUERIES.OUTGOING_DOCUMENT_DETAIL', id],
    queryFn: () => getOutgoingDocuments(id),
  });
};
