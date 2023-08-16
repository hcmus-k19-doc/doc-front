import { DocumentTypeDto } from 'models/doc-main-models';

export interface DocumentTypeTableRowDataType extends DocumentTypeDto {
  key: number;
  order: number;
  translatedType: string;
}

export interface DocumentTypeTableDataType {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: DocumentTypeTableRowDataType[];
}
