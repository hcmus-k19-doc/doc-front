import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocPaginationDto,
  IncomingDocumentDto,
  IncomingDocumentPutDto,
  SearchCriteriaDto,
  TransferDocDto,
} from 'models/doc-main-models';

function getIncomingDocuments(
  searchCriteria: Partial<SearchCriteriaDto>,
  page: number,
  pageSize: number
): Promise<DocPaginationDto<IncomingDocumentDto>> {
  return axios
    .post<DocPaginationDto<IncomingDocumentDto>>(
      `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/search`,
      searchCriteria,
      {
        params: {
          page: page - 1,
          pageSize: pageSize,
        },
      }
    )
    .then((response) => response.data);
}

async function createIncomingDocument(incomingDocument: FormData) {
  const response = await axios.post<IncomingDocumentDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/create`,
    incomingDocument
  );

  return response;
}

async function updateIncomingDocument(incomingDocument: IncomingDocumentPutDto) {
  const response = await axios.put<IncomingDocumentPutDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/update`,
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

async function transferDocuments(transferDocDto: TransferDocDto) {
  return await axios.post<void>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/transfer-documents`,
    transferDocDto
  );
}

const incomingDocumentService = {
  getIncomingDocuments,
  createIncomingDocument,
  getIncomingDocumentById,
  updateIncomingDocument,
  transferDocuments,
};

export default incomingDocumentService;
