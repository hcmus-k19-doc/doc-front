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
      return 'red';
    case t('PROCESSING_STATUS.IN_PROGRESS'):
    case t('PROCESSING_STATUS.WAITING_FOR_OUTGOING_NUMBER'):
    case t('PROCESSING_STATUS.READY_TO_RELEASE'):
      return 'yellow';
    case t('PROCESSING_STATUS.CLOSED'):
    case t('PROCESSING_STATUS.RELEASED'):
      return 'green';
    default:
      return 'red';
  }
};

export { getSelectedDocsMessage, getColorBaseOnStatus };
