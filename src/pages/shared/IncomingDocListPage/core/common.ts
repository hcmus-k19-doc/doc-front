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

export { getSelectedDocsMessage };
