import axios, { AxiosResponse } from 'axios';
import { REACT_APP_DOC_FILE_SERVICE_URL } from 'config/constant';
import { AttachmentDto } from 'models/doc-main-models';

async function downloadAttachments(attachmentDtoList: AttachmentDto[], incomingDocId: string) {
  const response = await axios.post(
    `${REACT_APP_DOC_FILE_SERVICE_URL}/files/download/${incomingDocId}`,
    attachmentDtoList,
    {
      responseType: 'blob',
    }
  );

  return response;
}

function saveZipFileToDisk(response: AxiosResponse<any, any>) {
  const url: string = window.URL.createObjectURL(new Blob([response.data]));
  const link: HTMLAnchorElement = document.createElement('a');
  const fileName: string = response.headers['content-disposition'].split('filename=')[1];
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

const attachmentService = {
  downloadAttachments,
  saveZipFileToDisk,
};

export default attachmentService;
