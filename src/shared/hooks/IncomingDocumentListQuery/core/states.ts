import { Dayjs } from 'dayjs';
import { ProcessingStatus } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

export type IncomingDocSearchState = {
  incomingNumber?: string;
  originalSymbolNumber?: string;
  documentTypeId?: number;
  distributionOrgId?: number;
  arrivingDate?: Dayjs[];
  processingDuration?: Dayjs[];
  summary?: string;
  status?: ProcessingStatus;
  documentName?: string;
};

export type IncomingDocQueryState = PaginationState & IncomingDocSearchState;
