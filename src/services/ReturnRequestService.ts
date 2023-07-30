import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import {
  ProcessingDocumentTypeEnum,
  ReturnRequestGetDto,
  ReturnRequestPostDto,
} from 'models/doc-main-models';

const RETURN_REQUEST_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/return-requests`;

async function getReturnRequests(
  processingDocumentType: ProcessingDocumentTypeEnum,
  documentId: number
) {
  return await axios.get<ReturnRequestGetDto[]>(
    `${RETURN_REQUEST_URL}/${processingDocumentType}/${documentId}/list`
  );
}

async function getReturnRequestById(
  processingDocumentType: ProcessingDocumentTypeEnum,
  id: number
) {
  return await axios.get<ReturnRequestGetDto>(
    `${RETURN_REQUEST_URL}/${processingDocumentType}/${id}/details`
  );
}

async function createReturnRequest(returnRequestPostDto: ReturnRequestPostDto) {
  return await axios.post<number[]>(`${RETURN_REQUEST_URL}`, returnRequestPostDto);
}

const returnRequestService = {
  getReturnRequests,
  getReturnRequestById,
  createReturnRequest,
};

export default returnRequestService;
