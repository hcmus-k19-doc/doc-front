import { DocumentTypeSearchCriteria } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

interface SearchState {
  searchCriteria: Partial<DocumentTypeSearchCriteria>;
}

export type DocDocumentTypeQueryState = PaginationState & SearchState;
