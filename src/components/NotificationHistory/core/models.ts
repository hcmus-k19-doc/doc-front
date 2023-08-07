import { FormInstance } from 'antd';
import { ParentFolderEnum } from 'models/doc-file-models';
import {
  AttachmentDto,
  ProcessingDocumentTypeEnum,
  TransferHistoryDto,
} from 'models/doc-main-models';

export interface NotificationHistoryProps {
  notifications: any[];
  onScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
  handleNotificationClose: () => void;
  isTransferHistoryLoading: boolean;
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
}

export interface TransferHistoryDetailModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  form: FormInstance;
  transferHistory: TransferHistoryDto;
  isTransferHistoryLoading: boolean;
}

export interface UserItem {
  email: string;
  gender: string;
  name: {
    first: string;
    last: string;
    title: string;
  };
  nat: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export type TableRowDataType = {
  key: number;
  id: number;
  type: ProcessingDocumentTypeEnum;
  fullText: string;
  attachments: AttachmentDto[];
  parentFolderEnum: ParentFolderEnum;
};
