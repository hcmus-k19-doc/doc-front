import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocPaginationDto,
  IncomingDocumentDto,
  IncomingDocumentPutDto,
  ProcessingDetailsDto,
  SearchCriteriaDto,
  TransferDocDto,
} from 'models/doc-main-models';

const INCOMING_DOCUMENTS_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents`;

function getIncomingDocuments(
  searchCriteria: Partial<SearchCriteriaDto>,
  page: number,
  pageSize: number
): Promise<DocPaginationDto<IncomingDocumentDto>> {
  return axios
    .post<DocPaginationDto<IncomingDocumentDto>>(
      `${INCOMING_DOCUMENTS_URL}/search`,
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
  return await axios.post<IncomingDocumentDto>(
    `${INCOMING_DOCUMENTS_URL}/create`,
    incomingDocument
  );
}

async function updateIncomingDocument(incomingDocument: IncomingDocumentPutDto) {
  return await axios.put<IncomingDocumentPutDto>(
    `${INCOMING_DOCUMENTS_URL}/update`,
    incomingDocument
  );
}

async function getIncomingDocumentById(id: number) {
  return await axios.get<IncomingDocumentDto>(`${INCOMING_DOCUMENTS_URL}/${id}`);
}

async function transferDocuments(transferDocDto: TransferDocDto) {
  return await axios.post<void>(`${INCOMING_DOCUMENTS_URL}/transfer-documents`, transferDocDto);
}

async function getProcessingDetails(incomingDocumentId: number) {
  return await axios.get<ProcessingDetailsDto[]>(
    `${INCOMING_DOCUMENTS_URL}/${incomingDocumentId}/processing-details`
  );
}

const incomingDocumentService = {
  getIncomingDocuments,
  createIncomingDocument,
  getIncomingDocumentById,
  updateIncomingDocument,
  transferDocuments,
  getProcessingDetails,
};

export default incomingDocumentService;
