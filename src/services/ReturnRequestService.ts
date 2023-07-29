import axios from 'axios';
import { PRIMARY_COLOR, REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { t } from 'i18next';
import {
  ProcessingDocumentTypeEnum,
  ReturnRequestGetDto,
  ReturnRequestPostDto,
} from 'models/doc-main-models';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

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
  const showAlert = useSweetAlert();
  try {
    const response = await axios.post<number[]>(`${RETURN_REQUEST_URL}`, returnRequestPostDto);
    console.log('response from createReturnRequest', response);
    if (response.status === 200) {
      return response;
    } else if (response.status === 400 || response.status === 404) {
      showAlert({
        icon: 'error',
        html: t('incomingDocListPage.message.attachment.not_found'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  } catch (error) {
    console.error(error);
  }
}

const returnRequestService = {
  getReturnRequests,
  getReturnRequestById,
  createReturnRequest,
};

export default returnRequestService;
