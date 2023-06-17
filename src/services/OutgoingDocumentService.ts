import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocPaginationDto,
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  OutgoingDocSearchCriteriaDto,
  OutgoingDocumentGetDto,
  OutgoingDocumentPutDto,
  PublishDocumentDto,
  TransferDocDto,
  TransferDocumentModalSettingDto,
  ValidateTransferDocDto,
} from 'models/doc-main-models';

const OUTGOING_DOCUMENTS_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/outgoing-documents`;

async function createOutgoingDocument(outgoingDocument: FormData) {
  const response = await axios.post<OutgoingDocumentGetDto>(
    `${OUTGOING_DOCUMENTS_URL}/create`,
    outgoingDocument
  );

  return response;
}

async function getOutgoingDocumentById(id: number) {
  return await axios.get<OutgoingDocumentGetDto>(`${OUTGOING_DOCUMENTS_URL}/${id}`);
}

async function updateOutgoingDocument(outgoingDocument: OutgoingDocumentPutDto) {
  return await axios.put<OutgoingDocumentGetDto>(
    `${OUTGOING_DOCUMENTS_URL}/update`,
    outgoingDocument
  );
}

async function publishOutgoingDocument(outgoingDocument: PublishDocumentDto) {
  return await axios.post<OutgoingDocumentGetDto>(
    `${OUTGOING_DOCUMENTS_URL}/release`,
    outgoingDocument
  );
}

async function getTransferOutgoingDocumentsSetting() {
  const response = await axios.get<TransferDocumentModalSettingDto>(
    `${OUTGOING_DOCUMENTS_URL}/transfer-outgoing-documents-setting`
  );
  return response.data;
}

function getOutgoingDocuments(
  searchCriteria: Partial<OutgoingDocSearchCriteriaDto>,
  page: number,
  pageSize: number
): Promise<DocPaginationDto<OutgoingDocumentGetDto>> {
  return axios
    .post<DocPaginationDto<OutgoingDocumentGetDto>>(
      `${OUTGOING_DOCUMENTS_URL}/search`,
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

async function transferDocuments(transferDocDto: TransferDocDto) {
  return await axios.post<void>(`${OUTGOING_DOCUMENTS_URL}/transfer-documents`, transferDocDto);
}

async function validateTransferDocuments(transferDocDto: TransferDocDto) {
  const response = await axios.post<ValidateTransferDocDto>(
    `${OUTGOING_DOCUMENTS_URL}/validate-transfer-documents`,
    transferDocDto
  );

  return response.data;
}

async function getTransferDocumentDetail(
  getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest
) {
  const response = await axios.post<GetTransferDocumentDetailCustomResponse>(
    `${OUTGOING_DOCUMENTS_URL}/get-transfer-documents-detail`,
    getTransferDocumentDetailRequest
  );

  return response.data;
}

async function getLinkedDocuments(incomingDocumentId: number) {
  const { data } = await axios.get<OutgoingDocumentGetDto[]>(
    `${OUTGOING_DOCUMENTS_URL}/link-documents/${incomingDocumentId}`
  );
  return data;
}

const outgoingDocumentService = {
  createOutgoingDocument,
  getOutgoingDocumentById,
  updateOutgoingDocument,
  getOutgoingDocuments,
  transferDocuments,
  publishOutgoingDocument,
  getTransferOutgoingDocumentsSetting,
  validateTransferDocuments,
  getTransferDocumentDetail,
  getLinkedDocuments,
};

export default outgoingDocumentService;
