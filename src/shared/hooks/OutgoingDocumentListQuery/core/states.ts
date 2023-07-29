import { Dayjs } from 'dayjs';
import { OutgoingDocumentStatusEnum } from 'models/doc-main-models';
import { PaginationState } from 'shared/models/states';

export type OutgoingDocSearchState = {
  outgoingNumber?: string;
  originalSymbolNumber?: string;
  documentTypeId?: number;
  releaseDate?: Dayjs[];
  summary?: string;
  status?: OutgoingDocumentStatusEnum;
};

export type DocQueryState = PaginationState & OutgoingDocSearchState;
