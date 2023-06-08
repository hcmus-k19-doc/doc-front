import React from 'react';
import { FormInstance, MenuProps, SelectProps } from 'antd';
import {
  GetTransferDocumentDetailCustomResponse,
  IncomingDocumentDto,
  OutgoingDocumentGetDto,
  ProcessMethod,
} from 'models/doc-main-models';

export const i18n_transfer_modal = 'transfer_modal';
export const i18n_transfer_modal_title = `${i18n_transfer_modal}.title`;
export const i18n_director = `${i18n_transfer_modal}.sidebar.director`;
export const i18n_chief_of_office = `${i18n_transfer_modal}.sidebar.chief_of_office`;
export const i18_secretary = `${i18n_transfer_modal}.sidebar.secretary`;
export const i18_expert = `${i18n_transfer_modal}.sidebar.expert`;
export const i18n_sender = `${i18n_transfer_modal}.director_view.sender`;
export const i18n_implementation_date = `${i18n_transfer_modal}.director_view.implementation_date`;
export const i18n_document = `${i18n_transfer_modal}.director_view.document`;
export const i18n_summary = `${i18n_transfer_modal}.director_view.summary`;
export const i18n_assignee = `${i18n_transfer_modal}.director_view.assignee`;
export const i18_collaborators = `${i18n_transfer_modal}.director_view.collaborators`;
export const i18n_processing_time = `${i18n_transfer_modal}.secretary_view.processing_time`;
export const i18n_is_infinite_processing_time = `${i18n_transfer_modal}.secretary_view.is_infinite_processing_time`;
export const i18n_document_number = `${i18n_transfer_modal}.document_number`;
export const i18n_ordinal_number = `${i18n_transfer_modal}.ordinal_number`;
export const i18n_process_method = `${i18n_transfer_modal}.manager_view.process_method`;

export type ComponentMap = {
  [key: number]: React.FC<any>;
};

export type MenuItem = Required<MenuProps>['items'][number];

export const getItem = (label: React.ReactNode, key: React.Key): MenuItem => {
  return {
    key,
    label,
  };
};

export interface TransferModalProps {
  isModalOpen: boolean;
  isSubmitLoading: boolean;
  handleOk: () => void;
  handleCancel: () => void;
  form: FormInstance;
  selectedDocs: any;
  type: string;
}

export interface TransferModalDetailProps {
  isModalOpen: boolean;
  handleClose: () => void;
  form: FormInstance;
  transferredDoc: IncomingDocumentDto | OutgoingDocumentGetDto;
  transferDocumentDetail: GetTransferDocumentDetailCustomResponse;
  type: string;
}

export interface MenuSelectProps {
  selectedKeys: string[];
}

export interface TransferDocScreenProps {
  form: FormInstance;
  selectedDocs: any;
  isTransferToSameLevel: boolean;
  isDocCollaborator: boolean;
  isReadOnlyMode: boolean;
  transferDate: string;
  senderName: string;
  processingDuration?: string;
  type: string;
}

export interface TransferDocScreenFormProps {
  summary: string;
  assignee: number;
  collaborators: number[];
  processingTime: string;
  isInfiniteProcessingTime: boolean;
  processMethod: string;
}

export const processMethodOptions: SelectProps['options'] = [
  { value: ProcessMethod.BAO_CAO_KET_QUA, label: 'Báo cáo kết quả thực hiện' },
  { value: ProcessMethod.LUU_THAM_KHAO, label: 'Lưu tham khảo' },
  { value: ProcessMethod.SOAN_VAN_BAN, label: 'Soạn văn bản trả lời' },
];
