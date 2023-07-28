import { Dayjs } from 'dayjs';
import { ProcessingStatus } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

export type SearchState = {
  incomingNumber?: string;
  originalSymbolNumber?: string;
  documentTypeId?: number;
  distributionOrgId?: number;
  arrivingDate?: Dayjs[];
  processingDuration?: Dayjs[];
  summary?: string;
  status?: ProcessingStatus;
};

export type DocQueryState = PaginationState & SearchState;
