import React, { useState } from 'react';
import { Badge, BadgeProps, Calendar } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

import ExpiredDocList from '../ExpiredDocList';

const getListData = (value: Dayjs) => {
  let listData;
  switch (value.date()) {
    case 8:
      listData = [
        { id: 1, type: 'warning' },
        { id: 2, type: 'success' },
      ];
      break;
    case 10:
      listData = [
        { id: 3, type: 'warning' },
        { id: 4, type: 'success' },
        { id: 5, type: 'error' },
      ];
      break;
    case 15:
      listData = [
        { id: 6, type: 'warning' },
        { id: 7, type: 'success' },
        { id: 8, type: 'error' },
        { id: 9, type: 'error' },
        { id: 10, type: 'error' },
        { id: 11, type: 'error' },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const monthCellRender = (value: Dayjs) => {
  const num = getMonthData(value);
  return num ? (
    <div className='notes-month'>
      <section>{num}</section>
      <span>Backlog number</span>
    </div>
  ) : null;
};

const dateCellRender = (value: Dayjs) => {
  const listData = getListData(value);
  return (
    <ul className='events'>
      {listData.map((item) => (
        <li key={item.id}>
          <Badge status={item.type as BadgeProps['status']} />
        </li>
      ))}
    </ul>
  );
};

const ReminderCalendar = () => {
  const [value, setValue] = useState(() => dayjs());

  const onSelect = (newValue: Dayjs) => {
    setValue(newValue);
  };

  const onPanelChange = (newValue: Dayjs) => {
    setValue(newValue);
  };

  return (
    <>
      <ExpiredDocList />
      <Calendar
        value={value}
        onSelect={onSelect}
        onPanelChange={onPanelChange}
        dateCellRender={dateCellRender}
        monthCellRender={monthCellRender}
      />
    </>
  );
};

export default ReminderCalendar;
