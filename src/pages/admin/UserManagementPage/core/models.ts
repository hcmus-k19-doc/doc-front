import { DocSystemRoleEnum } from 'models/doc-main-models';

export interface UserTableRowDataType {
  key: number;
  id: number;
  order: number;
  version: number;
  username: string;
  password?: string;
  email: string;
  fullName: string;
  role: DocSystemRoleEnum;
  roleTitle: string;
  translatedRole: string;
  department: string;
  departmentId: number;
}

export interface UserTableDataType {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: UserTableRowDataType[];
}

export interface FooterProps {
  selectedUsers: number[];
  setSelectedUsers: (users: number[]) => void;
}
