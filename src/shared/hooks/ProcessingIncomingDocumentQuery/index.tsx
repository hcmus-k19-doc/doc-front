import { useQueries } from '@tanstack/react-query';
import distributionOrgService from 'services/DistributionOrgService';
import documentTypeService from 'services/DocumentTypeService';

const getDocumentTypes = async () => {
  const response = await documentTypeService.getDocumentTypes();
  return response.data;
};

const getDistributionOrg = async () => {
  const response = await distributionOrgService.getDistributionOrgs();
  return response.data;
};

export const useDropDownQuery = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['documentTypes'],
        queryHash: 'documentTypes',
        queryFn: getDocumentTypes,
      },
      {
        queryKey: ['distributionOrgs'],
        queryHash: 'distributionOrgs',
        queryFn: getDistributionOrg,
      },
    ],
  });
};
