import axios from 'axios';

import { REACT_APP_DOC_MAIN_SERVICE_URL } from '../config/constant';
import { DocPaginationDto, IncomingDocumentDto } from '../models/doc-main-models';
import { PAGE_SIZE } from '../pages/ChuyenVien/CVDocInList/models';

export function getIncomingDocuments(
  query: string,
  page: number,
  pageSize = PAGE_SIZE
): Promise<DocPaginationDto<IncomingDocumentDto>> {
  return axios
    .get<DocPaginationDto<IncomingDocumentDto>>(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents`,
      {
        params: {
          query,
          page: page - 1,
          pageSize,
        },
      }
    )
    .then((response) => response.data);
}
