import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import documentReminderService from 'services/DocumentReminderService';

import { DocumentReminderDateState } from './core/state';

const documentReminderDateState = atom<DocumentReminderDateState>({
  key: 'DOCUMENT_REMINDER_DATE_STATE',
  default: {
    date: dayjs(),
  },
});

const documentReminderDetailsState = atom<DocumentReminderDateState>({
  key: 'DOCUMENT_REMINDER_DETAILS_STATE',
  default: {
    date: dayjs(),
  },
});

export const useDocumentReminderDateReq = () => useRecoilState(documentReminderDateState);

export const useDocumentReminderRes = () => {
  const query = useRecoilValue<DocumentReminderDateState>(documentReminderDateState);

  const { data, isLoading } = useQuery({
    queryKey: ['QUERIES.DOCUMENT_REMINDER_LIST', query],
    queryFn: async () => {
      const { data } = await documentReminderService.getCurrentUserDocumentReminders(query.date);
      return data;
    },
  });

  return { data, isLoading };
};

export const useDocumentReminderDetailsReq = () => useRecoilState(documentReminderDetailsState);

export const useDocumentReminderDetailsRes = () => {
  const query = useRecoilValue<DocumentReminderDateState>(documentReminderDetailsState);

  const { data, isLoading } = useQuery({
    queryKey: ['QUERIES.DOCUMENT_REMINDER_DETAILS', query],
    queryFn: async () => {
      const { data } = await documentReminderService.getCurrentUserDocumentReminderDetails(
        query.date
      );
      return data;
    },
  });

  return { data, isLoading };
};
