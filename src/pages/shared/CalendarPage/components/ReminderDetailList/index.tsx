import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, List, MenuProps, Space, Typography } from 'antd';
import { documentReminderStatusItems } from 'components/PageHeader/core';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { t } from 'i18next';
import { DocumentReminderDetailsDto, DocumentReminderStatusEnum } from 'models/doc-main-models';
import { useDocumentReminderDetailsRes } from 'shared/hooks/DocumentReminderQuery';
import { DEFAULT_DATE_FORMAT } from 'utils/DateTimeUtils';

import { globalNavigate } from '../../../../../utils/RoutingUtils';

const { Text } = Typography;

dayjs.extend(customParseFormat);

function ReminderDetailList() {
  const { data, isLoading } = useDocumentReminderDetailsRes();

  const [status, setStatus] = useState<DocumentReminderStatusEnum>(
    DocumentReminderStatusEnum.ACTIVE
  );

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setStatus(e.key as DocumentReminderStatusEnum);
  };

  function handleOnDetailClick(incomingNumberId: number) {
    globalNavigate(`/docin/in-detail/${incomingNumberId}`);
  }

  const menuProps = {
    items: documentReminderStatusItems,
    onClick: handleMenuClick,
  };

  return (
    <>
      <div className='flex justify-end'>
        <Dropdown trigger={['click']} menu={menuProps}>
          <Button>
            <Space>
              <div className='w-28'>{t(`calendar.reminder_status.${status.toLowerCase()}`)}</div>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </div>
      <List
        className='mt-3'
        loading={isLoading}
        itemLayout='horizontal'
        dataSource={data?.[status]}
        renderItem={(item: DocumentReminderDetailsDto) => {
          return (
            <List.Item
              className='cursor-pointer'
              onClick={() => handleOnDetailClick(item.incomingDocumentId)}>
              <List.Item.Meta
                title={<div className='font-bold'>{item.incomingNumber}</div>}
                description={item.summary}
              />
              <Text type='secondary' className='text-end'>
                {format(new Date(item.expirationDate), DEFAULT_DATE_FORMAT)}
              </Text>
            </List.Item>
          );
        }}
      />
    </>
  );
}

export default ReminderDetailList;
