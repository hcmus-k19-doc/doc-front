import { UserSearchCriteria } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

interface SearchState {
  userSearchCriteria: Partial<UserSearchCriteria>;
}

export type DocUserQueryState = PaginationState & SearchState;
