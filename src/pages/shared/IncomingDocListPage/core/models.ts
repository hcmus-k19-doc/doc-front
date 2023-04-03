import { AttachmentDto } from 'models/doc-main-models';

export type TableRowDataType = {
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
};

export type TableDataType = {
  page: number;
  totalElements: number;
  payload: TableRowDataType[];
};

export const PAGE_SIZE = 3;
