import { DocumentTypeDto } from 'models/doc-main-models';

export interface DocumentTypeTableRowDataType extends DocumentTypeDto {
  key: number;
  translatedType: string;
}

export interface DocumentTypeTableDataType {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: DocumentTypeTableRowDataType[];
}

export interface FooterProps {
  selectedDocumentTypes: number[];
  setSelectedDocumentTypes: (users: number[]) => void;
}
