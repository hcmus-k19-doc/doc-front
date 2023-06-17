import { useQuery } from '@tanstack/react-query';
import outgoingDocumentService from 'services/OutgoingDocumentService';

const getDocOutLinkedDocumentList = async (id: number) => {
  const response = await outgoingDocumentService.getLinkedDocuments(id);
  return response;
};

export const useDocOutLinkedDocumentsQuery = (id: number) => {
  return useQuery({
    queryKey: ['docout.link_documents', id],
    queryHash: 'docout.link_documents',
    queryFn: () => getDocOutLinkedDocumentList(id),
    retry: false,
  });
};
