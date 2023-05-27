import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocPaginationDto,
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  IncomingDocumentDto,
  IncomingDocumentPutDto,
  ProcessingDetailsDto,
  ProcessingDocumentTypeEnum,
  SearchCriteriaDto,
  StatisticsWrapperDto,
  TransferDocDto,
  TransferDocumentModalSettingDto,
  ValidateTransferDocDto,
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
  return await axios.put<IncomingDocumentDto>(`${INCOMING_DOCUMENTS_URL}/update`, incomingDocument);
}

async function getIncomingDocumentById(id: number) {
  return await axios.get<IncomingDocumentDto>(`${INCOMING_DOCUMENTS_URL}/${id}`);
}

async function transferDocuments(transferDocDto: TransferDocDto) {
  return await axios.post<void>(`${INCOMING_DOCUMENTS_URL}/transfer-documents`, transferDocDto);
}

async function getProcessingDetails(
  processingDocumentType: ProcessingDocumentTypeEnum,
  documentId: number,
  onlyAssignee?: boolean
) {
  return await axios.get<ProcessingDetailsDto[]>(
    `${INCOMING_DOCUMENTS_URL}/${processingDocumentType}/${documentId}/processing-details`,
    {
      params: {
        onlyAssignee: onlyAssignee,
      },
    }
  );
}

async function getTransferDocumentsSetting() {
  const response = await axios.get<TransferDocumentModalSettingDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/incoming-documents/transfer-documents-setting`
  );

  return response.data;
}

async function validateUserWithRoleAndDocId(request: GetTransferDocumentDetailRequest) {
  return (
    await axios.post<boolean>(
      `${INCOMING_DOCUMENTS_URL}/is-user-working-on-document-with-specific-role`,
      request
    )
  ).data;
}

async function validateTransferDocuments(transferDocDto: TransferDocDto) {
  const response = await axios.post<ValidateTransferDocDto>(
    `${INCOMING_DOCUMENTS_URL}/validate-transfer-documents`,
    transferDocDto
  );

  return response.data;
}

async function getStatistics() {
  const { data } = await axios.get<StatisticsWrapperDto>(`${INCOMING_DOCUMENTS_URL}/statistics`);
  return data;
}

async function getTransferDocumentDetail(
  getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest
) {
  const response = await axios.post<GetTransferDocumentDetailCustomResponse>(
    `${INCOMING_DOCUMENTS_URL}/get-transfer-documents-detail`,
    getTransferDocumentDetailRequest
  );

  return response.data;
}

async function closeDocument(incomingDocumentId: number) {
  const { data } = await axios.put<string>(
    `${INCOMING_DOCUMENTS_URL}/close-document/${incomingDocumentId}`
  );
  return data;
}

const incomingDocumentService = {
  getIncomingDocuments,
  createIncomingDocument,
  getIncomingDocumentById,
  updateIncomingDocument,
  transferDocuments,
  getProcessingDetails,
  getTransferDocumentsSetting,
  validateUserWithRoleAndDocId,
  validateTransferDocuments,
  getStatistics,
  getTransferDocumentDetail,
  closeDocument,
};

export default incomingDocumentService;
