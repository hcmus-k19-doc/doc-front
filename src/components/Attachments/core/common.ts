import { format, parseISO } from 'date-fns';
import { saveAs } from 'file-saver';
import { FileType } from 'models/doc-main-models';

export const parseLocalDateTimeToFormatedDate = (dateTimeString: string, t: any) => {
  const dateTime = parseISO(dateTimeString);

  const formattedDate = format(dateTime, 'dd-MM-yyyy');
  const formattedTime = format(dateTime, 'HH:mm:ss');

  return `${formattedDate} ${t('attachments.at_time')} ${formattedTime}`;
};

export const getMimeFromFileType = (type: FileType) => {
  switch (type) {
    case FileType.JPG:
      return 'image/jpeg';
    case FileType.PDF:
      return 'application/pdf';
    case FileType.PNG:
      return 'image/png';
  }
};

export const downloadFileFromBlob = (blob: Blob, fileName: string) => {
  saveAs(blob, fileName);
};
