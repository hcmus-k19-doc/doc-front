import { DistributionOrganizationSearchCriteria } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

interface SearchState {
  searchCriteria: Partial<DistributionOrganizationSearchCriteria>;
}

export type DocDistributionOrganizationQueryState = PaginationState & SearchState;
