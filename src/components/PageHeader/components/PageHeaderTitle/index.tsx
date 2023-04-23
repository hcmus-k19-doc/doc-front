import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space, Typography } from 'antd';
import { DocumentReminderStatusEnum } from 'models/doc-main-models';

const { Title } = Typography;

interface PageHeaderTitleProps {
  t: (key: string) => string;
  menuProps: MenuProps;
  status: DocumentReminderStatusEnum;
}

export default function PageHeaderTitle({ t, menuProps, status }: PageHeaderTitleProps) {
  return (
    <div className='flex justify-between mt-3'>
      <Title className='ml-5' level={4}>
        {t('page_header.reminder')}
      </Title>
      <Dropdown trigger={['click']} menu={menuProps}>
        <Button>
          <Space>
            <div className='w-28'>
              {t(`page_header.document_reminder_status.${status.toLowerCase()}`)}
            </div>
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
}
