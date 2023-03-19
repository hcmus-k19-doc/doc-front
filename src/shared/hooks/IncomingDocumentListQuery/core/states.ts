import { Dayjs } from 'dayjs';

type PaginationState = {
  page: number;
};

export type SearchState = {
  incomingNumber?: string;
  originalSymbolNumber?: string;
  documentTypeId?: number;
  distributionOrgId?: number;
  arrivingDate?: Dayjs[];
  processingDuration?: Dayjs[];
  summary?: string;
};

export type DocQueryState = PaginationState & SearchState;
