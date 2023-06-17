export interface LinkDocumentModalProps {
  isModalOpen: boolean;
  isIncomingDocument: boolean;
  selectedDocuments: any;
  handleOk: () => void;
  handleCancel: () => void;
}

export type TableRowDataType = {
  name: string;
  key: number;
  status: string;
  id: number;
  type: string;
  originalSymbolNumber: string;
  docNumber: string;
  summary: string;
};

export type TableDataType = {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: TableRowDataType[];
};
