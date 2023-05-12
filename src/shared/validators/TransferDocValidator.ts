import { message } from 'antd';
import {
  DocSystemRoleEnum,
  IncomingDocumentDto,
  ProcessingDocumentRoleEnum,
  TransferDocDto,
  TransferDocumentType,
  UserDto,
} from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';

import { GetTransferDocumentDetailRequest } from './../../models/doc-main-models';

const validateAssignee = (assigneeId?: number, t?: any) => {
  if (!assigneeId) {
    message.error(t('transfer_modal.form.assignee_required'));
    return false;
  }

  return true;
};

const validateCollaborators = (assigneeId?: number, collaboratorIds?: number[], t?: any) => {
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
    message.error(
      t(
        'transfer_modal.form.only_in_progress_docs_can_be_transferred_to_manager_or_secretary_or_expert'
      )
    );
    return false;
  }
  return true;
};

const isValidProcessMethod = (processMethod?: string, t?: any) => {
  if (!processMethod) {
    message.error(t('transfer_modal.form.process_method_required'));
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

const isValidUserWithRole = async (transferDocDto: TransferDocDto, t?: any) => {
  let isValidUserWithRoleResult = true;
  // kiem tra xem cac assignee va collaborator co dang xu ly van ban nay role hien tai hay khong
  transferDocDto?.documentIds?.forEach(async (docId) => {
    const assigneeRequest: GetTransferDocumentDetailRequest = {
      incomingDocumentId: docId,
      userId: transferDocDto.assigneeId as number,
      role: ProcessingDocumentRoleEnum.ASSIGNEE,
    };
    // call the validateUserWithRoleAndDocId api
    const assigneeResponse = await incomingDocumentService.validateUserWithRoleAndDocId(
      assigneeRequest
    );
    console.log('assigneeResponse', assigneeResponse);

    if (!assigneeResponse) {
      console.log('1');
      isValidUserWithRoleResult = false;
      transferDocDto.collaboratorIds?.forEach(async (collaboratorId) => {
        const collaboratorRequest: GetTransferDocumentDetailRequest = {
          incomingDocumentId: docId,
          userId: collaboratorId as number,
          role: ProcessingDocumentRoleEnum.COLLABORATOR,
        };
        const collaboratorResponse = await incomingDocumentService.validateUserWithRoleAndDocId(
          collaboratorRequest
        );
        console.log('collaboratorResponse', collaboratorResponse);
        if (!collaboratorResponse) {
          console.log('3');
          isValidUserWithRoleResult = false;
          return isValidUserWithRoleResult;
        } else {
          console.log('4');
          isValidUserWithRoleResult = true;
          return isValidUserWithRoleResult;
        }
      });
      return isValidUserWithRoleResult;
    } else {
      console.log('2');
      isValidUserWithRoleResult = true;
      return isValidUserWithRoleResult;
    }
  });
  console.log('isValidUserWithRoleResult', isValidUserWithRoleResult);

  if (isValidUserWithRoleResult) {
    message.error(t('transfer_modal.form.some_user_is_already_assigned_to_this_doc'));
    return false;
  }

  return true;
};

const validateTransferDocs = async (
  selectedDocs: IncomingDocumentDto[],
  transferDocModalItem: TransferDocumentType,
  transferDocDto: TransferDocDto,
  t?: any,
  currentUser?: UserDto
) => {
  if (transferDocDto?.isTransferToSameLevel) {
    /*
     - neu chuyen cung cap thi van ban phai la van ban chua xu ly doi voi van thu va check assignee
    */
    if (!validateAssignee(transferDocDto?.assigneeId, t)) {
      return false;
    }
    if (currentUser?.role === DocSystemRoleEnum.VAN_THU && !isUnprocessedDocs(selectedDocs, t)) {
      return false;
    }
    if (currentUser?.role !== DocSystemRoleEnum.VAN_THU && !isProcessingDocs(selectedDocs, t)) {
      return false;
    }
  } else {
    /*
     - neu chuyen khac cap thi van ban phai la van ban dang xu ly, check assignee va collaborator, processing time
    */
    if (
      !validateAssignee(transferDocDto?.assigneeId, t) ||
      !validateCollaborators(transferDocDto?.assigneeId, transferDocDto?.collaboratorIds, t)
    ) {
      return false;
    }

    if (transferDocModalItem === TransferDocumentType.TRANSFER_TO_TRUONG_PHONG) {
      if (!isValidProcessMethod(transferDocDto.processMethod, t)) {
        return false;
      }
    }

    if (
      !isValidProcessingTime(
        transferDocDto?.processingTime,
        transferDocDto?.isInfiniteProcessingTime,
        t
      )
    ) {
      return false;
    }

    if (
      transferDocModalItem === TransferDocumentType.TRANSFER_TO_GIAM_DOC &&
      currentUser?.role === DocSystemRoleEnum.VAN_THU
    ) {
      if (!isUnprocessedDocs(selectedDocs, t)) {
        return false;
      }
    } else {
      if (!isProcessingDocs(selectedDocs, t)) {
        return false;
      }
    }
  }

  const isValidUserWithRoleResult = await isValidUserWithRole(transferDocDto, t);

  if (!isValidUserWithRoleResult) {
    return false;
  }

  return true;
};

export {
  validateAssignee,
  validateCollaborators,
  isUnprocessedDocs,
  isProcessingDocs,
  validateTransferDocs,
};
