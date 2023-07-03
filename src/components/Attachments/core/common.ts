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

export const downloadFileFromByteArray = (byteArray: any, fileType: FileType, fileName: string) => {
//   const blob = new Blob([byteArray], { type: getMimeFromFileType(fileType) });
//   saveAs(blob, fileName);
  const url: string = window.URL.createObjectURL(new Blob([byteArray]));
  const link: HTMLAnchorElement = document.createElement('a');
//   const fileName: string = response.headers['content-disposition'].split('filename=')[1];
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
