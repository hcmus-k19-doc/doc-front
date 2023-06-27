import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Card, Dropdown, Empty, List, MenuProps, Space, Tag, Tooltip } from 'antd';
import { documentReminderStatusItems } from 'components/PageHeader/core';
import { format } from 'date-fns';
import { t } from 'i18next';
import {
  DocumentReminderDetailsDto,
  DocumentReminderStatusEnum,
  ProcessingDocumentTypeEnum,
} from 'models/doc-main-models';
import { useDocumentReminderDetailsRes } from 'shared/hooks/DocumentReminderQuery';
import { DEFAULT_DATE_FORMAT } from 'utils/DateTimeUtils';
import { globalNavigate, routingUtils } from 'utils/RoutingUtils';

import { getStatusColor } from './core';

import '../../index.css';

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

  function handleOnDetailClick(documentId: number, documentType: ProcessingDocumentTypeEnum) {
    globalNavigate(`/list/${routingUtils.getUrl(documentType)}/${documentId}`);
  }

  function handleOnRefreshClick() {
    onRefresh();
  }

  const menuProps = {
    items: documentReminderStatusItems,
    onClick: handleMenuClick,
  };

  function getDocumentTypeLabel(documentType: ProcessingDocumentTypeEnum) {
    switch (documentType) {
      case ProcessingDocumentTypeEnum.INCOMING_DOCUMENT:
        return t('calendar.reminder_detail_list.document_type.INCOMING_DOCUMENT');
      case ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT:
        return t('calendar.reminder_detail_list.document_type.OUTGOING_DOCUMENT');
    }
  }

  return (
    <div className='work-list'>
      <div className='flex justify-end'>
        <Space direction='vertical'>
          <div className='flex'>
            <Dropdown trigger={['click']} menu={menuProps}>
              <Button>
                <Space>
                  <div className='w-28'>
                    {t(`calendar.reminder_status.${status.toLowerCase()}`)}
                  </div>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
            <Button className='w-full ml-5' type='primary' onClick={handleOnRefreshClick}>
              {t('common.button.refresh')}
            </Button>
          </div>
        </Space>
      </div>
      {!data?.[status].length ? (
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
                onClick={() => handleOnDetailClick(item.documentId, item.documentType)}
                className='w-full cursor-pointer mb-5 task-card'
                title={
                  <div className='font-bold'>
                    <Tooltip title={t('calendar.reminder_detail_list.document_type.title')}>
                      <span>{getDocumentTypeLabel(item.documentType)}: </span>
                    </Tooltip>
                    <Tooltip title={t('calendar.reminder_detail_list.document_name')}>
                      <span>{item.documentName}</span>
                    </Tooltip>
                    {item.documentNumber && (
                      <Tooltip title={t('calendar.reminder_detail_list.document_number')}>
                        <span> &minus; {`${item.documentNumber}`}</span>
                      </Tooltip>
                    )}
                  </div>
                }>
                <Tag color={getStatusColor(status)}>
                  {format(new Date(item.expirationDate), DEFAULT_DATE_FORMAT)}
                </Tag>
                <div className='flex mt-4'>
                  <span className='font-semibold mr-1'>
                    {t('calendar.reminder_detail_list.summary')}
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: item.summary }} />
                </div>
              </Card>
            );
          }}
        />
      )}
    </div>
  );
}

export default ReminderDetailList;
