export interface NotificationHistoryProps {
  notifications: any[];
  onScroll: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
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
