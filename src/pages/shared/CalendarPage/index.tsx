import React from 'react';
import { Calendar } from 'antd';
import { Dayjs } from 'dayjs';
import {
  useDocumentReminderDateReq,
  useDocumentReminderDetailsReq,
  useDocumentReminderRes,
} from 'shared/hooks/DocumentReminderQuery';

import DateCell from './components/DateCellComponent';
import ReminderDetailList from './components/ReminderDetailList';

import './index.css';

export default function CalendarPage() {
  const [documentReminder, setDocumentReminder] = useDocumentReminderDateReq();
  const [documentReminderDetails, setDocumentReminderDetails] = useDocumentReminderDetailsReq();
  const { data } = useDocumentReminderRes();

  function handleOnSelect(date: Dayjs) {
    setDocumentReminder({ date });
    setDocumentReminderDetails({ date });
  }

  function handleOnPanelChange(date: Dayjs) {
    setDocumentReminder({ date });
    setDocumentReminderDetails({ date });
  }

  return (
    <>
      <ReminderDetailList />
      <Calendar
        value={documentReminder.date}
        onSelect={handleOnSelect}
        onPanelChange={handleOnPanelChange}
        dateCellRender={(value) => <DateCell value={value} data={data} />}
      />
    </>
  );
}
