import { useQuery } from '@tanstack/react-query';
import { getDistributionOrganizations } from 'services/DistributionOrganizationService';

export function useDistributionOrgRes() {
  const { data: distributionOrgs } = useQuery({
    queryKey: ['QUERIES.DISTRIBUTION_ORGANIZATIONS'],
    queryFn: () => {
      return getDistributionOrganizations();
    },
  });

  return {
    distributionOrgs,
  };
}
