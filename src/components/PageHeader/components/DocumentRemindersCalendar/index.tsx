import React from 'react';
import { Badge, BadgeProps, Calendar } from 'antd';
import { Dayjs } from 'dayjs';
import { RecoilRoot } from 'recoil';
import {
  useDocumentReminderDateReq,
  useDocumentReminderDetailsReq,
  useDocumentReminderRes,
} from 'shared/hooks/DocumentReminderQuery';
import { YEAR_MONTH_DAY_FORMAT } from 'utils/DateTimeUtils';

import { DocumentReminderStatusEnum } from '../../../../models/doc-main-models';
import DocumentReminderDetailsList from '../ExpiredDocList';

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
            <li className='flex justify-end' key={item}>
              <Badge status={type as BadgeProps['status']} />
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <DocumentReminderDetailsList selectedStatus={status} />
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

function DocumentRemindersCalendarWrapper({ status }: DocumentRemindersCalendarProps) {
  return (
    <RecoilRoot>
      <DocumentRemindersCalendar status={status} />
    </RecoilRoot>
  );
}

export default DocumentRemindersCalendarWrapper;
