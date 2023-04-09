import React from 'react';
import { List, Skeleton, Typography } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import { ExpireDocDto } from './core';

const { Text } = Typography;

dayjs.extend(customParseFormat);

const items: ExpireDocDto[] = [
  {
    id: 1,
    name: 'test',
    summary: 'test',
    dateExpired: dayjs(),
  },
  {
    id: 2,
    name: 'test',
    summary: 'test',
    dateExpired: dayjs(),
  },
];

const ExpiredDocList = () => {
  return (
    <List
      itemLayout='horizontal'
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          <Skeleton avatar title={false} loading={false} active>
            <List.Item.Meta
              title={
                <a href='https://ant.design' className='font-bold'>
                  {item.summary}
                </a>
              }
              description='Ant Design, a design language for background applications, is refined by Ant UED Team'
            />
            <Text type='secondary' className='w-32 text-end'>
              {item.dateExpired.format(DAY_MONTH_YEAR_FORMAT)}
            </Text>
          </Skeleton>
        </List.Item>
      )}
    />
  );
};

export default ExpiredDocList;
