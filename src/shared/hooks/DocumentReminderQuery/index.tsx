import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import documentReminderService from 'services/DocumentReminderService';
import { YEAR_MONTH_FORMAT } from 'utils/DateTimeUtils';

import { DocumentReminderDateState } from './core/state';

dayjs().locale('vi');

const documentReminderDateState = atom<DocumentReminderDateState>({
  key: 'DOCUMENT_REMINDER_DATE_STATE',
  default: {
    date: dayjs(),
  },
});

export const useDocumentReminderDateReq = () => useRecoilState(documentReminderDateState);

export const useDocumentReminderByMonthYearRes = () => {
  const query = useRecoilValue<DocumentReminderDateState>(documentReminderDateState);

  const { data, isLoading } = useQuery({
    queryKey: ['QUERIES.DOCUMENT_REMINDER_LIST', query],
    keepPreviousData: true,
    queryFn: async () => {
      const res = await documentReminderService.getCurrentUserDocumentReminders(
        query.date.format(YEAR_MONTH_FORMAT)
      );

      return res.data;
    },
  });

  return { data, isLoading };
};
