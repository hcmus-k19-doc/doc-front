import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { DocPaginationDto, IncomingDocumentDto, SearchCriteriaDto } from 'models/doc-main-models';

export function getIncomingDocuments(
  searchCriteria: Partial<SearchCriteriaDto>,
  page: number
): Promise<DocPaginationDto<IncomingDocumentDto>> {
  return axios
    .post<DocPaginationDto<IncomingDocumentDto>>(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/search`,
      searchCriteria,
      {
        params: {
          page: page - 1,
        },
      }
    )
    .then((response) => response.data);
}
