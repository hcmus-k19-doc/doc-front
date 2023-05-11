import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { OutgoingDocumentGetDto, OutgoingDocumentPostDto } from 'models/doc-main-models';

async function createOutgoingDocument(outgoingDocument: OutgoingDocumentPostDto) {
  const response = await axios.post<OutgoingDocumentGetDto>(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/outgoing-documents/create`,
    outgoingDocument
  );

  return response;
}

const outgoingDocumentService = {
  createOutgoingDocument,
};

export default outgoingDocumentService;
