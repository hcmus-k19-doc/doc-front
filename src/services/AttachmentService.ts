import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';

async function uploadAttachments(attachments: FormData) {
  const response = await axios.post(
    `${REACT_APP_DOC_MAIN_SERVICE_URL}/attachments/upload`,
    attachments
  );

  return response;
}

const attachmentService = {
  uploadAttachments,
};

export default attachmentService;
