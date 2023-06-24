import { DocumentReminderStatusEnum } from 'models/doc-main-models';

export function getStatusColor(status: DocumentReminderStatusEnum) {
  switch (status) {
    case DocumentReminderStatusEnum.ACTIVE:
      return 'green';
    case DocumentReminderStatusEnum.CLOSE_TO_EXPIRATION:
      return 'yellow';
    case DocumentReminderStatusEnum.EXPIRED:
      return 'red';
  }
}
