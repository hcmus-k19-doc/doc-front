import { Dayjs } from 'dayjs';
import { PaginationState } from 'shared/models/states';

export type OutgoingDocSearchState = {
  outgoingNumber?: string;
  originalSymbolNumber?: string;
  documentTypeId?: number;
  releaseDate?: Dayjs[];
  summary?: string;
};

export type DocQueryState = PaginationState & OutgoingDocSearchState;
