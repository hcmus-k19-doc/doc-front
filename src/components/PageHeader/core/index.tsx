import React from 'react';
import { MenuProps } from 'antd';
import { t } from 'i18next';
import { DocumentReminderStatusEnum } from 'models/doc-main-models';

export const languageItems: MenuProps['items'] = [
  {
    key: '1',
    label: t('page_header.languages.vi'),
  },
];

export const documentReminderStatusItems: MenuProps['items'] = [
  {
    label: t(`calendar.reminder_status.${DocumentReminderStatusEnum.ACTIVE.toLowerCase()}`),
    key: DocumentReminderStatusEnum.ACTIVE,
  },
  {
    label: t(
      `calendar.reminder_status.${DocumentReminderStatusEnum.CLOSE_TO_EXPIRATION.toLowerCase()}`
    ),
    key: DocumentReminderStatusEnum.CLOSE_TO_EXPIRATION,
  },
  {
    label: t(`calendar.reminder_status.${DocumentReminderStatusEnum.EXPIRED.toLowerCase()}`),
    key: DocumentReminderStatusEnum.EXPIRED,
  },
];
