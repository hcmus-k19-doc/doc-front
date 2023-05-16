import React from 'react';
import { FormInstance, MenuProps } from 'antd';
import { IncomingDocumentDto } from 'models/doc-main-models';

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
  handleOk: () => void;
  handleCancel: () => void;
  form: FormInstance;
  selectedDocs: IncomingDocumentDto[];
}

export interface TransferModalDetailProps {
  isModalOpen: boolean;
  handleClose: () => void;
  form: FormInstance;
  transferredDoc: IncomingDocumentDto;
}

export interface MenuSelectProps {
  selectedKeys: string[];
}

export interface TransferDocScreenProps {
  form: FormInstance;
  selectedDocs: IncomingDocumentDto[];
  isTransferToSameLevel: boolean;
}

export interface TransferDocScreenFormProps {
  summary: string;
  assignee: number;
  collaborators: number[];
  processingTime: string;
  isInfiniteProcessingTime: boolean;
  processMethod: string;
}
