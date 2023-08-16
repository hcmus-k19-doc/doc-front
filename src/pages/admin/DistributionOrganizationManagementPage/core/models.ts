import { DistributionOrganizationDto } from 'models/doc-main-models';

export interface DistributionOrganizationTableRowDataType extends DistributionOrganizationDto {
  key: number;
  order: number;
  name: string;
  symbol: string;
}

export interface DistributionOrganizationTableDataType {
  page: number;
  pageSize: number;
  totalElements: number;
  payload: DistributionOrganizationTableRowDataType[];
}
