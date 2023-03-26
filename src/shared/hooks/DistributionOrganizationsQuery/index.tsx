import { useQuery } from '@tanstack/react-query';
import distributionOrgService from 'services/DistributionOrgService';

const getDistributionOrganizations = async () => {
  const response = await distributionOrgService.getDistributionOrgs();
  return response.data;
};

export function useDistributionOrgRes() {
  const { data: distributionOrgs } = useQuery({
    queryKey: ['QUERIES.DISTRIBUTION_ORGANIZATIONS'],
    queryFn: getDistributionOrganizations,
  });

  return {
    distributionOrgs,
  };
}
