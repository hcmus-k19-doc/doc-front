import { DepartmentDto } from 'models/doc-main-models';

export interface DepartmentTableRowDataType extends DepartmentDto {
  key: number;
  order: number;
}

export interface DepartmentTableDataType {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: DepartmentTableRowDataType[];
}

export interface FooterProps {
  selectedDepartments: number[];
  setSelectedDepartments: (users: number[]) => void;
}
