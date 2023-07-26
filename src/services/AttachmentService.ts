import axios, { AxiosResponse } from 'axios';
import {
  PRIMARY_COLOR,
  REACT_APP_DOC_FILE_SERVICE_URL,
  REACT_APP_DOC_MAIN_SERVICE_URL,
} from 'config/constant';
import { t } from 'i18next';
import { ParentFolderEnum } from 'models/doc-file-models';
import { AttachmentDto } from 'models/doc-main-models';
import { TableRowDataType as IncomingTableRowType } from 'pages/shared/IncomingDocListPage/core/models';
import { TableRowDataType as OutgoingTableRowType } from 'pages/shared/OutgoingDocListPage/core/models';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

const DOC_FILE_SERVICE_FILE_URL = `${REACT_APP_DOC_FILE_SERVICE_URL}/files`;
const ATTACHMENT_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/attachments`;
const S3_URL = `${DOC_FILE_SERVICE_FILE_URL}/s3`;

async function downloadAttachments(attachmentDtoList: AttachmentDto[], incomingDocId: string) {
  return await axios.post(
    `${REACT_APP_DOC_FILE_SERVICE_URL}/files/download/${incomingDocId}`,
    attachmentDtoList,
    {
      responseType: 'blob',
    }
  );
}

async function getFileContentFromS3Key(key: string) {
  return await axios.get(`${DOC_FILE_SERVICE_FILE_URL}/get-byte-array-from-s3-key?fileKey=${key}`, {
    responseType: 'blob',
  });
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

async function downloadZipFileFromS3(parentFolder: ParentFolderEnum, folderName: number) {
  try {
    const res = await axios.get(`${S3_URL}/${parentFolder}/${folderName}`, {
      responseType: 'blob',
    });

    if (res.status !== 200) {
      return res.status;
    }

    saveZipFileToDisk(res);
    return res.status;
  } catch (e) {
    console.error(e);
  }
}

export async function handleDownloadAttachment(
  record: IncomingTableRowType | OutgoingTableRowType,
  parentFolder: ParentFolderEnum,
  setError?: (error: string) => void,
  setLoading?: (loading: boolean) => void
) {
  const showAlert = useSweetAlert();
  setLoading?.(true);
  try {
    const responseStatus = await downloadZipFileFromS3(parentFolder, record.id);

    if (responseStatus === 204) {
      showAlert({
        icon: 'error',
        html: t('incomingDocListPage.message.attachment.not_found'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (setError) {
        setError(error.response?.data.message);
      }
      console.error(error.response?.data.message);
    } else {
      console.error(error);
    }
  } finally {
    setLoading?.(false);
  }
}

export async function handleDownloadAttachmentInTransferHistory(
  parentFolder: ParentFolderEnum,
  id: number,
  setError?: (error: string) => void,
  setLoading?: (loading: boolean) => void
) {
  const showAlert = useSweetAlert();
  setLoading?.(true);
  try {
    const responseStatus = await downloadZipFileFromS3(parentFolder, id);

    if (responseStatus === 204) {
      showAlert({
        icon: 'error',
        html: t('incomingDocListPage.message.attachment.not_found'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (setError) {
        setError(error.response?.data.message);
      }
      console.error(error.response?.data.message);
    } else {
      console.error(error);
    }
  } finally {
    setLoading?.(false);
  }
}

export async function deleteAttachmentById(id: number) {
  return await axios.delete(`${ATTACHMENT_URL}/${id}`);
}

const attachmentService = {
  downloadAttachments,
  saveZipFileToDisk,
  handleDownloadAttachment,
  getFileContentFromS3Key,
  handleDownloadAttachmentInTransferHistory,
  deleteAttachmentById,
};

export default attachmentService;
