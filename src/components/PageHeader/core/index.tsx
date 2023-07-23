import { MenuProps } from 'antd';
import i18n, { EN, VN } from 'assets/i18n/i18n.config';
import { t } from 'i18next';
import { DocumentReminderStatusEnum } from 'models/doc-main-models';

export const languageItems: MenuProps['items'] = [
  {
    key: 'vie',
    label: t('page_header.languages.vi'),
    onClick: () => {
      if (i18n.language === VN) {
        return;
      }

      i18n
        .changeLanguage('vi')
        .then(() => window.location.reload())
        .catch((e) => console.error(e));
    },
  },
  {
    key: 'eng',
    label: t('page_header.languages.en'),
    onClick: () => {
      if (i18n.language === EN) {
        return;
      }

      i18n
        .changeLanguage('en')
        .then(() => window.location.reload())
        .catch((e) => console.error(e));
    },
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
