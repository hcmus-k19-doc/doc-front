import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocPaginationDto,
  IncomingDocumentDto,
  IncomingDocumentPostDto,
  SearchCriteriaDto,
} from 'models/doc-main-models';

function getIncomingDocuments(
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

async function createIncomingDocument(incomingDocument: IncomingDocumentPostDto) {
  const response = await axios.post<IncomingDocumentDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/create`,
    incomingDocument
  );

  return response;
}

async function getIncomingDocumentById(id: number) {
  const response = await axios.get<IncomingDocumentDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/${id}`
  );

  return response;
}

const incomingDocumentService = {
  getIncomingDocuments,
  createIncomingDocument,
  getIncomingDocumentById,
};

export default incomingDocumentService;
