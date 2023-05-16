import { OutgoingDocumentGetDto } from 'models/doc-main-models';

export type TableRowDataType = {
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
}
