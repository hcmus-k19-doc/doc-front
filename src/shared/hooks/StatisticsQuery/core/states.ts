import { SelectProps } from 'antd';
import { Dayjs } from 'dayjs';
import { PaginationState } from 'shared/models/states';

import { ProcessingDocumentTypeEnum } from '../../../../models/doc-main-models';

export type SearchState = {
  expertIds?: [];
  statisticDate?: Dayjs[];
  docType?: ProcessingDocumentTypeEnum;
};

export const docTypeOptions: SelectProps['options'] = [
  { value: ProcessingDocumentTypeEnum.INCOMING_DOCUMENT, label: 'Văn bản đến' },
  { value: ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT, label: 'Văn bản đi' },
];

export type StatisticsQueryState = PaginationState & SearchState;
