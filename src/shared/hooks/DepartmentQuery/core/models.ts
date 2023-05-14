import { DepartmentSearchCriteria } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

interface SearchState {
  searchCriteria: Partial<DepartmentSearchCriteria>;
}

export type DocDepartmentQueryState = PaginationState & SearchState;
