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
};

export type TableDataType = {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: TableRowDataType[];
};

export const PAGE_SIZE = 10;
