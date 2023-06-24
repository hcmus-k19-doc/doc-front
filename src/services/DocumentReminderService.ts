import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { Dayjs } from 'dayjs';
import { DocumentReminderWrapperDto } from 'models/doc-main-models';
import { YEAR_MONTH_DAY_FORMAT } from 'utils/DateTimeUtils';

const DOCUMENT_REMINDERS_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/document-reminders`;

async function getCurrentUserDocumentReminders(yearMonth: Dayjs) {
  return await axios.get(
    `${DOCUMENT_REMINDERS_URL}/current-user/${yearMonth.month() + 1}/${yearMonth.year()}`
  );
}

async function getCurrentUserDocumentReminderDetails(date: Dayjs) {
  return await axios.get<DocumentReminderWrapperDto>(
    `${DOCUMENT_REMINDERS_URL}/current-user/details/${date.format(YEAR_MONTH_DAY_FORMAT)}`
  );
}

async function getCurrentUserDocumentRemindersDetailsByMonthYear(month: number, year: number) {
  return await axios.get(`${DOCUMENT_REMINDERS_URL}/current-user/details/${year}/${month}`);
}

const documentReminderService = {
  getCurrentUserDocumentReminders,
  getCurrentUserDocumentReminderDetails,
  getCurrentUserDocumentRemindersDetailsByMonthYear,
};

export default documentReminderService;
