import { useQuery } from '@tanstack/react-query';
import { getDocumentTypes } from 'services/DocumentTypeService';

export function useDocumentTypesRes() {
  const { data: documentTypes } = useQuery({
    queryKey: ['QUERIES.DOCUMENT_TYPES'],
    queryFn: () => {
      return getDocumentTypes();
    },
  });

  return {
    documentTypes,
  };
}
