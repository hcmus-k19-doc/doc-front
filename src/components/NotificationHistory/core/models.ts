import { FormInstance } from 'antd';
import { TransferHistoryDto } from 'models/doc-main-models';

export interface NotificationHistoryProps {
  notifications: any[];
  onScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
  handleNotificationClose: () => void;
}

export interface TransferHistoryDetailModalProps {
  isModalOpen: boolean;
  handleClose: () => void;
  form: FormInstance;
  transferHistory: TransferHistoryDto;
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
