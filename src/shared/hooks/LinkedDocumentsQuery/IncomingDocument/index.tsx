import { useQuery } from '@tanstack/react-query';
import incomingDocumentService from 'services/IncomingDocumentService';

const getDocInLinkedDocumentList = async (id: number) => {
  const response = await incomingDocumentService.getLinkedDocuments(id);
  return response;
};

export const useDocInLinkedDocumentsQuery = (id: number) => {
  return useQuery({
    queryKey: ['docin.link_documents', id],
    queryHash: 'docin.link_documents',
    queryFn: () => getDocInLinkedDocumentList(id),
    retry: false,
  });
};
