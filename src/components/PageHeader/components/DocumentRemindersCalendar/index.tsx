import React from 'react';
import { Calendar } from 'antd';
import { Dayjs } from 'dayjs';
import { DocumentReminderStatusEnum } from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import {
  useDocumentReminderDateReq,
  useDocumentReminderDetailsReq,
  useDocumentReminderRes,
} from 'shared/hooks/DocumentReminderQuery';

import DateCell from '../DateCell';
import DocumentReminderDetailsList from '../ExpiredDocList';

interface DocumentRemindersCalendarProps {
  status: DocumentReminderStatusEnum;
}

function DocumentRemindersCalendar({ status }: DocumentRemindersCalendarProps) {
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
      <DocumentReminderDetailsList selectedStatus={status} />
      <Calendar
        value={documentReminder.date}
        onSelect={handleOnSelect}
        onPanelChange={handleOnPanelChange}
        dateCellRender={(value) => <DateCell value={value} data={data} />}
      />
    </>
  );
}

function DocumentRemindersCalendarWrapper({ status }: DocumentRemindersCalendarProps) {
  return (
    <RecoilRoot>
      <DocumentRemindersCalendar status={status} />
    </RecoilRoot>
  );
}

export default DocumentRemindersCalendarWrapper;
