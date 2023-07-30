import { AttachmentDto, OutgoingDocumentGetDto } from 'models/doc-main-models';

export type TableRowDataType = {
  ordinalNumber: number;
  name: string;
  key: number;
  id: number;
  type: string;
  releaseNumber: string;
  originId: string;
  releaseDate: string;
  issuePlace: string;
  summary: string;
  fullText: string;
  status: string;
  objType: string;
  attachments: AttachmentDto[];
  isDocTransferred: boolean;
  isDocCollaborator: boolean;
  isTransferable: boolean;
  deadline: string;
  isDocTransferredByNextUserInFlow: boolean;
};

export type TableDataType = {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: TableRowDataType[];
};

export interface FooterProps {
  selectedDocs: OutgoingDocumentGetDto[];
  setSelectedDocs: (docs: OutgoingDocumentGetDto[]) => void;
  csvData: any;
}
