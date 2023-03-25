import { useQuery } from '@tanstack/react-query';
import documentTypeService from 'services/DocumentTypeService';

const getDocumentTypes = async () => {
  const response = await documentTypeService.getDocumentTypes();
  return response.data;
};

export function useDocumentTypesRes() {
  const { data: documentTypes } = useQuery({
    queryKey: ['QUERIES.DOCUMENT_TYPES'],
    queryFn: getDocumentTypes,
  });

  return {
    documentTypes,
  };
}
