import { Dayjs } from 'dayjs';
import { PaginationState } from 'shared/models/states';

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
