import { ProcessingDocumentTypeEnum, ReturnRequestGetDto } from 'models/doc-main-models';

export type ReturnRequestProps = {
  docId: number;
  processingDocumentType: ProcessingDocumentTypeEnum;
};
