import { OutgoingDocumentStatusEnum, ProcessingStatus } from 'models/doc-main-models';

export type DocStatusProps = {
  status: OutgoingDocumentStatusEnum | ProcessingStatus;
};
