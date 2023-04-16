import React from 'react';
import { Badge, BadgeProps, Calendar } from 'antd';
import { Dayjs } from 'dayjs';
import { RecoilRoot } from 'recoil';
import {
  useDocumentReminderByMonthYearRes,
  useDocumentReminderDateReq,
} from 'shared/hooks/DocumentReminderQuery';
import { YEAR_MONTH_DAY_FORMAT } from 'utils/DateTimeUtils';

import ExpiredDocList from '../ExpiredDocList';

function getMonthData(value: Dayjs) {
  if (value.month() === 8) {
    return 1394;
  }
}

function MonthCellRender(value: Dayjs) {
  const num = getMonthData(value);
  return num ? (
    <div className='notes-month'>
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
}

function DocumentRemindersCalendar() {
  const [documentReminder, setDocumentReminder] = useDocumentReminderDateReq();
  const { data, isLoading } = useDocumentReminderByMonthYearRes();

  function handleOnSelect(date: Dayjs) {
    setDocumentReminder({ date });
  }

  function handleOnPanelChange(date: Dayjs) {
    setDocumentReminder({ date });
  }

  function DateCellRender(value: Dayjs) {
    const date = value.format(YEAR_MONTH_DAY_FORMAT);
    return (
      <ul className='events'>
        {data?.[date]?.map((item: string) => {
          let type: string;
          switch (item) {
            case 'ACTIVE':
              type = 'success';
              break;
            case 'EXPIRED':
              type = 'error';
              break;
            default:
              type = 'warning';
          }

          return (
            <li key={item}>
              <Badge status={type as BadgeProps['status']} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <ExpiredDocList isLoading={isLoading} />
      <Calendar
        value={documentReminder.date}
        onSelect={handleOnSelect}
        onPanelChange={handleOnPanelChange}
        dateCellRender={DateCellRender}
        monthCellRender={MonthCellRender}
      />
    </>
  );
}

function DocumentRemindersCalendarWrapper() {
  return (
    <RecoilRoot>
      <DocumentRemindersCalendar />
    </RecoilRoot>
  );
}

export default DocumentRemindersCalendarWrapper;
