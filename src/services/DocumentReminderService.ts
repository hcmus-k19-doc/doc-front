import axios from 'axios';
import { Dayjs } from 'dayjs';

import { REACT_APP_DOC_MAIN_SERVICE_URL } from '../config/constant';
import { YEAR_MONTH_DAY_FORMAT, YEAR_MONTH_FORMAT } from '../utils/DateTimeUtils';

const DOCUMENT_REMINDERS_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/document-reminders`;

async function getCurrentUserDocumentReminders(yearMonth: Dayjs) {
  return await axios.get(
    `${DOCUMENT_REMINDERS_URL}/current-user/${yearMonth.format(YEAR_MONTH_FORMAT)}`
  );
}

async function getCurrentUserDocumentReminderDetails(date: Dayjs) {
  return await axios.get(
    `${DOCUMENT_REMINDERS_URL}/current-user/details/${date.format(YEAR_MONTH_DAY_FORMAT)}`
  );
}

const documentReminderService = {
  getCurrentUserDocumentReminders,
  getCurrentUserDocumentReminderDetails,
};

export default documentReminderService;
