import { Dayjs } from 'dayjs';

type PaginationState = {
  page: number;
};

export type SearchState = {
  incomingNumber?: string;
  originalSymbolNumber?: string;
  documentType?: string;
  distributionOrg?: string;
  arrivingDate?: Dayjs[];
  processingDuration?: Dayjs[];
  summary?: string;
};

export type DocQueryState = PaginationState & SearchState;
