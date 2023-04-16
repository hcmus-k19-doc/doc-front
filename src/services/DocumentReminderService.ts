import axios from 'axios';

import { REACT_APP_DOC_MAIN_SERVICE_URL } from '../config/constant';

const DOCUMENT_REMINDERS_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/document-reminders`;

async function getCurrentUserDocumentReminders(yearMonth: string) {
  return await axios.get(`${DOCUMENT_REMINDERS_URL}/${yearMonth}`);
}

const documentReminderService = {
  getCurrentUserDocumentReminders,
};

export default documentReminderService;
