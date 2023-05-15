import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { OutgoingDocumentGetDto, OutgoingDocumentPutDto } from 'models/doc-main-models';

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

const outgoingDocumentService = {
  createOutgoingDocument,
  getOutgoingDocumentById,
  updateOutgoingDocument,
};

export default outgoingDocumentService;
