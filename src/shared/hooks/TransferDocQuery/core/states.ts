export interface TransferQueryState {
  documentIds?: number[];
  summary?: string;
  assigneeId?: number;
  collaboratorIds?: number[];
  processingTime?: string;
  isInfiniteProcessingTime?: boolean;
  processMethod?: string;
  isTransferToSameLevel?: boolean;
}
