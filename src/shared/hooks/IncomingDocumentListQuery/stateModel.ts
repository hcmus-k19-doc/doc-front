type PaginationState = {
  page?: number;
};

type SearchState = {
  incomingNumber?: string;
  originalSymbolNumber?: string;
  documentType?: string;
  distributionOrg?: string;
  arrivingDate?: string;
  processingDuration?: string;
  summary?: string;
};

export type DocQueryState = PaginationState & SearchState;
