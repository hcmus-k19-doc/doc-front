import React, { useRef, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Empty, List, MenuProps, Space, Typography } from 'antd';
import { documentReminderStatusItems } from 'components/PageHeader/core';
import { format } from 'date-fns';
import { t } from 'i18next';
import { DocumentReminderDetailsDto, DocumentReminderStatusEnum } from 'models/doc-main-models';
import { useDocumentReminderDetailsRes } from 'shared/hooks/DocumentReminderQuery';
import { DEFAULT_DATE_FORMAT } from 'utils/DateTimeUtils';
import { globalNavigate } from 'utils/RoutingUtils';

const { Text } = Typography;

interface Props {
  onRefresh: () => void;
}

function ReminderDetailList({ onRefresh }: Props) {
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

  function handleOnRefreshClick() {
    onRefresh();
  }

  const menuProps = {
    items: documentReminderStatusItems,
    onClick: handleMenuClick,
  };

  return (
    <div className='work-list'>
      <div className='flex justify-end'>
        <Space direction='vertical'>
          <Button className='w-full' type='primary' onClick={handleOnRefreshClick}>
            {t('common.button.refresh')}
          </Button>
          <Dropdown trigger={['click']} menu={menuProps}>
            <Button>
              <Space>
                <div className='w-28'>{t(`calendar.reminder_status.${status.toLowerCase()}`)}</div>
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>
      </div>
      {!data ? (
        <Empty className='mt-3 mb-10' description={t('common.no_data.no_work')} />
      ) : (
        <List
          className='my-10'
          loading={isLoading}
          itemLayout='horizontal'
          dataSource={data?.[status]}
          renderItem={(item: DocumentReminderDetailsDto) => {
            return (
              <Card
                onClick={() => handleOnDetailClick(item.incomingDocumentId)}
                className='w-full cursor-pointer'
                title={<div className='font-bold'>{item.incomingNumber}</div>}>
                <p dangerouslySetInnerHTML={{ __html: item.summary }} />
                <Text type='secondary' className='text-end'>
                  {format(new Date(item.expirationDate), DEFAULT_DATE_FORMAT)}
                </Text>
              </Card>
            );
          }}
        />
      )}
    </div>
  );
}

export default ReminderDetailList;
