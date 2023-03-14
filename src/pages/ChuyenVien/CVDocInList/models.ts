import { Dispatch, SetStateAction } from 'react';

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
  totalElements: number;
  payload: TableRowDataType[];
};

export interface FooterProps {
  totalElements: number;
  setPage: Dispatch<SetStateAction<number>>;
}

export const PAGE_SIZE = 3;
