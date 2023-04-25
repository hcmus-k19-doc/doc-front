import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown, Layout, Menu, MenuProps, Modal, Popover, Space } from 'antd';
import logo from 'assets/icons/logo.png';
import { useAuth } from 'components/AuthComponent';
import { DocumentReminderStatusEnum } from 'models/doc-main-models';
import securityService from 'services/SecurityService';
import * as authUtils from 'utils/AuthUtils';

import DocumentRemindersCalendarWrapper from './components/DocumentRemindersCalendar';
import PageHeaderTitle from './components/PageHeaderTitle';

import './index.css';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [status, setStatus] = useState<DocumentReminderStatusEnum>(
    DocumentReminderStatusEnum.ACTIVE
  );

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setStatus(e.key as DocumentReminderStatusEnum);
  };

  const [modal, contextHolder] = Modal.useModal();

  const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
    onClick: () => {
      navigate('/hello');
    },
  }));

  const languageItems: MenuProps['items'] = [
    {
      key: '1',
      label: t('page_header.languages.en'),
    },
    {
      key: '2',
      label: t('page_header.languages.vi'),
    },
  ];

  const documentReminderStatusItems: MenuProps['items'] = [
    {
      label: t(
        `page_header.document_reminder_status.${DocumentReminderStatusEnum.ACTIVE.toLowerCase()}`
      ),
      key: DocumentReminderStatusEnum.ACTIVE,
    },
    {
      label: t(
        `page_header.document_reminder_status.${DocumentReminderStatusEnum.CLOSE_TO_EXPIRATION.toLowerCase()}`
      ),
      key: DocumentReminderStatusEnum.CLOSE_TO_EXPIRATION,
    },
    {
      label: t(
        `page_header.document_reminder_status.${DocumentReminderStatusEnum.EXPIRED.toLowerCase()}`
      ),
      key: DocumentReminderStatusEnum.EXPIRED,
    },
  ];

  const confirmLogout = () => {
    modal.confirm({
      title: t('page_header.logout.modal.title'),
      icon: <ExclamationCircleOutlined />,
      content: t('page_header.logout.modal.content'),
      okText: t('page_header.logout.modal.ok_text'),
      cancelText: t('page_header.logout.modal.cancel_text'),
      onOk: async () => {
        const token = authUtils.getAuth();
        await securityService.logout(token?.refresh_token);
        logout();
      },
      centered: true,
    });
  };

  const menuProps = {
    items: documentReminderStatusItems,
    onClick: handleMenuClick,
  };

  return (
    <Header
      className='header flex items-center justify-center border-b-2'
      style={{ backgroundColor: 'white' }}>
      <div className='logo flex-none w-40'>
        <Link to='/'>
          <img src={logo} style={{ width: '50%' }} alt='doc' />
        </Link>
      </div>
      <Menu
        theme='light'
        mode='horizontal'
        defaultSelectedKeys={['1']}
        items={items1}
        className='flex-auto'
      />
      <Dropdown menu={{ items: languageItems }} placement='bottomRight'>
        <Space>
          <GlobalOutlined />
        </Space>
      </Dropdown>

      <Badge overflowCount={99} size='small' className='ml-5'>
        <Popover
          overlayInnerStyle={{ width: '700px' }}
          placement='bottomRight'
          title={<PageHeaderTitle t={t} menuProps={menuProps} status={status} />}
          content={<DocumentRemindersCalendarWrapper status={status} />}
          trigger='click'
          showArrow={false}>
          <BellOutlined />
        </Popover>
      </Badge>

      <LogoutOutlined className='ml-5' onClick={confirmLogout} />
      {contextHolder}
    </Header>
  );
};

export default PageHeader;
