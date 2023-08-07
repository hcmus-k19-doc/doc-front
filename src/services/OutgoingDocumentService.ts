import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  DocPaginationDto,
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  IncomingDocumentDto,
  OutgoingDocSearchCriteriaDto,
  OutgoingDocumentGetDto,
  OutgoingDocumentGetListDto,
  PublishDocumentDto,
  TransferDocDto,
  TransferDocumentModalSettingDto,
  ValidateTransferDocDto,
} from 'models/doc-main-models';

const OUTGOING_DOCUMENTS_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/outgoing-documents`;

async function createOutgoingDocument(outgoingDocument: FormData) {
  return await axios.post<OutgoingDocumentGetDto>(
    `${OUTGOING_DOCUMENTS_URL}/create`,
    outgoingDocument
  );
}

async function getOutgoingDocumentById(id: number) {
  return await axios.get<OutgoingDocumentGetDto>(`${OUTGOING_DOCUMENTS_URL}/${id}`);
}

async function updateOutgoingDocument(outgoingDocument: FormData) {
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
): Promise<DocPaginationDto<OutgoingDocumentGetListDto>> {
  return axios
    .post<DocPaginationDto<OutgoingDocumentGetListDto>>(
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
  const { data } = await axios.get<IncomingDocumentDto[]>(
    `${OUTGOING_DOCUMENTS_URL}/link-documents/${incomingDocumentId}`
  );
  return data;
}

async function linkDocuments(targetDocumentId: number, incomingDocuments: number[]) {
  const { data } = await axios.post(
    `${OUTGOING_DOCUMENTS_URL}/link-documents/${targetDocumentId}`,
    incomingDocuments
  );
  console && console.log('linkDocuments', targetDocumentId, incomingDocuments);
  return data;
}

async function unlinkDocument(targetDocumentId: number, incomingDocumentId: number) {
  const { data } = await axios.delete(
    `${OUTGOING_DOCUMENTS_URL}/link-documents/${targetDocumentId}?linkedDocumentId=${incomingDocumentId}`
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
  linkDocuments,
  unlinkDocument,
};

export default outgoingDocumentService;
