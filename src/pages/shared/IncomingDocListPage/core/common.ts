import { message } from 'antd';
import { IncomingDocumentDto, TransferDocDto } from 'models/doc-main-models';

const validateAssigneeAndCollaborators = (
  assigneeId?: number,
  collaboratorIds?: number[],
  t?: any
) => {
  if (!assigneeId) {
    message.error(t('transfer_modal.form.assignee_required'));
    return false;
  }
  if (collaboratorIds?.length === 0 || !collaboratorIds) {
    message.error(t('transfer_modal.form.collaborators_required'));
    return false;
  }
  if (collaboratorIds?.includes(assigneeId as number)) {
    message.error(t('transfer_modal.form.collaborator_can_not_has_same_value_with_assignee'));
    return false;
  }
  return true;
};

const isUnprocessedDocs = (selectedDocs: IncomingDocumentDto[], t?: any) => {
  const result = selectedDocs.every((doc) => doc.status === t('PROCESSING_STATUS.UNPROCESSED'));
  if (!result) {
    message.error(t('transfer_modal.form.only_unprocessed_docs_can_be_transferred_to_director'));
    return false;
  }
  return true;
};

const isProcessingDocs = (selectedDocs: IncomingDocumentDto[], t?: any) => {
  const result = selectedDocs.every((doc) => doc.status === t('PROCESSING_STATUS.IN_PROGRESS'));
  if (!result) {
    message.error(t('transfer_modal.form.only_in_progress_docs_can_be_transferred_to_manager'));
    return false;
  }
  return true;
};

const isValidProcessingTime = (
  processingTime?: string,
  isInfiniteProcessingTime?: boolean,
  t?: any
) => {
  if (!isInfiniteProcessingTime && !processingTime) {
    message.error(t('transfer_modal.form.processing_time_required'));
    return false;
  }
  return true;
};

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

const validateTransferDocs = (
  selectedDocs: IncomingDocumentDto[],
  transferDocModalItem: number,
  transferDocDto: TransferDocDto,
  t?: any
) => {
  if (
    !validateAssigneeAndCollaborators(
      transferDocDto?.assigneeId,
      transferDocDto?.collaboratorIds,
      t
    )
  ) {
    return false;
  }
  if (transferDocModalItem === 1) {
    if (!isUnprocessedDocs(selectedDocs, t)) {
      return false;
    }
  } else if (transferDocModalItem === 2) {
    if (
      !isProcessingDocs(selectedDocs, t) ||
      !isValidProcessingTime(
        transferDocDto?.processingTime,
        transferDocDto?.isInfiniteProcessingTime,
        t
      )
    ) {
      return false;
    }
  }
  return true;
};

export {
  validateAssigneeAndCollaborators,
  isUnprocessedDocs,
  getSelectedDocsMessage,
  isProcessingDocs,
  validateTransferDocs,
};
