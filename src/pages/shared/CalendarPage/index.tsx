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
  const [_, setDocumentReminderDetails] = useDocumentReminderDetailsReq();
  const { data, refetch } = useDocumentReminderRes();

  function handleOnSelect(date: Dayjs) {
    setDocumentReminder({ date });
    setDocumentReminderDetails({ date });
  }

  function handleOnPanelChange(date: Dayjs) {
    setDocumentReminder({ date });
    setDocumentReminderDetails({ date });
  }

  function handleOnRefresh() {
    refetch();
  }

  return (
    <>
      <ReminderDetailList onRefresh={handleOnRefresh} />
      <Calendar
        value={documentReminder.date}
        onSelect={handleOnSelect}
        onPanelChange={handleOnPanelChange}
        dateCellRender={(value) => <DateCell value={value} data={data} />}
      />
    </>
  );
}
