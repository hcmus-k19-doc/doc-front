import { OutgoingDocumentGetDto } from 'models/doc-main-models';

const getSelectedDocsMessage = (selectedDocs: OutgoingDocumentGetDto[], t?: any) => {
  const unprocessedDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.UNPROCESSED')
  ).length;
  const processingDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.IN_PROGRESS')
  ).length;
  const waitingOutgoingNumberDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.WAITING_FOR_OUTGOING_NUMBER')
  ).length;
  const readyReleaseDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.READY_TO_RELEASE')
  ).length;
  const releasedDocs = selectedDocs.filter(
    (doc) => doc.status === t('PROCESSING_STATUS.RELEASED')
  ).length;

  return {
    unprocessedDocs,
    processingDocs,
    waitingOutgoingNumberDocs,
    readyReleaseDocs,
    releasedDocs,
  };
};

export { getSelectedDocsMessage };
