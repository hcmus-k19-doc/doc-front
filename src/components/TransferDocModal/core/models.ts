import React from 'react';
import { MenuProps } from 'antd';

export const i18n_transfer_modal = 'transfer_modal';
export const i18n_transfer_modal_title = `${i18n_transfer_modal}.title`;
export const i18n_director = `${i18n_transfer_modal}.sidebar.director`;
export const i18n_chief_of_office = `${i18n_transfer_modal}.sidebar.chief_of_office`;
export const i18_secretary = `${i18n_transfer_modal}.sidebar.secretary`;
export const i18n_sender = `${i18n_transfer_modal}.director_view.sender`;
export const i18n_implementation_date = `${i18n_transfer_modal}.director_view.implementation_date`;
export const i18n_document = `${i18n_transfer_modal}.director_view.document`;
export const i18n_summary = `${i18n_transfer_modal}.director_view.summary`;
export const i18n_receiver = `${i18n_transfer_modal}.director_view.receiver`;

export type MenuItem = Required<MenuProps>['items'][number];

export const getItem = (label: React.ReactNode, key: React.Key): MenuItem => {
  return {
    key,
    label,
  };
};

export interface Props {
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

export interface MenuSelectProps {
  selectedKeys: string[];
}
