import { AttachmentDto, IncomingDocumentDto } from 'models/doc-main-models';

export type TableRowDataType = {
  ordinalNumber: number;
  name: string;
  key: number;
  id: number;
  issueLevel: string;
  type: string;
  arriveId: string;
  originId: string;
  arriveDate: string;
  issuePlace: string;
  summary: string;
  fullText: string;
  status: string;
  deadline: string;
  attachments: AttachmentDto[];
  isDocTransferred: boolean;
  isDocCollaborator: boolean;
};

export type TableDataType = {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: TableRowDataType[];
};

export interface IncomingDocListSearchProps {
  selectedDocumentsToLink: any;
  handleSelectedDocumentsToLinkChanged: (documents: any) => void;
  linkedDocuments: any;
}
