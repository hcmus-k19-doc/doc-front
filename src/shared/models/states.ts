import axios from 'axios';
import { t } from 'i18next';

import { PRIMARY_COLOR } from '../../config/constant';
import { ParentFolderEnum } from '../../models/doc-file-models';
import { TableRowDataType } from '../../pages/shared/IncomingDocListPage/core/models';
import attachmentService from '../../services/AttachmentService';
import { useSweetAlert } from '../hooks/SwalAlert';

export interface PaginationState {
  page: number;
  pageSize: number;
}

export const PAGE_SIZE = 10;

export const PaginationStateUtils = {
  defaultValue: {
    page: 1,
    pageSize: PAGE_SIZE,
  },
};
