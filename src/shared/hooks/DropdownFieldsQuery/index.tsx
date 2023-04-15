import { useQueries } from '@tanstack/react-query';
import distributionOrgService from 'services/DistributionOrgService';
import documentTypeService from 'services/DocumentTypeService';
import folderService from 'services/FolderService';

const getDocumentTypes = async () => {
  const response = await documentTypeService.getDocumentTypes();
  return response.data;
};

const getDistributionOrgs = async () => {
  const response = await distributionOrgService.getDistributionOrgs();
  return response.data;
};

const getFolders = async () => {
  const response = await folderService.getFolders();
  return response.data;
};

export const useDropDownFieldsQuery = () => {
  return useQueries({
    queries: [
      {
        queryKey: ['folders'],
        queryHash: 'folders',
        queryFn: getFolders,
      },
      {
        queryKey: ['documentTypes'],
        queryHash: 'documentTypes',
        queryFn: getDocumentTypes,
      },
      {
        queryKey: ['distributionOrgs'],
        queryHash: 'distributionOrgs',
        queryFn: getDistributionOrgs,
      },
    ],
  });
};
