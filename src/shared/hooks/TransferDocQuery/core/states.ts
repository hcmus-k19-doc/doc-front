export interface TransferQueryState {
  documentIds?: number[];
  summary?: string;
  assigneeId?: number;
  collaboratorIds?: number[];
  processingTime?: string;
  isInfiniteProcessingTime?: boolean;
  processingMethod?: string;
  isTransferToSameLevel?: boolean;
}
