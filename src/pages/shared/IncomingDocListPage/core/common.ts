import { IncomingDocumentDto } from 'models/doc-main-models';

const getSelectedDocsMessage = (selectedDocs: IncomingDocumentDto[], t?: any) => {
  const unprocessedDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.UNPROCESSED')
  ).length;
  const processingDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.IN_PROGRESS')
  ).length;
  const closedDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.CLOSED')
  ).length;

  return { unprocessedDocs, processingDocs, closedDocs };
};

const getColorBaseOnStatus = (status: string, t: any) => {
  switch (status) {
    case t('PROCESSING_STATUS.UNPROCESSED'):
      return 'gray';
    case t('PROCESSING_STATUS.IN_PROGRESS'):
      return 'green';
    case t('PROCESSING_STATUS.CLOSED'):
      return 'red';
    default:
      return 'gray';
  }
};

export { getSelectedDocsMessage, getColorBaseOnStatus };
