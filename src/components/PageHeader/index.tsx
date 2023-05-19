import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  DatabaseOutlined,
  ExclamationCircleOutlined,
  FundOutlined,
  GlobalOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown, Layout, Menu, MenuProps, Modal, Popover } from 'antd';
import logo from 'assets/icons/logo.png';
import { useAuth } from 'components/AuthComponent';
import { DocumentReminderStatusEnum } from 'models/doc-main-models';
import securityService from 'services/SecurityService';
import * as authUtils from 'utils/AuthUtils';

import DocumentRemindersCalendarWrapper from './components/DocumentRemindersCalendar';
import PageHeaderTitle from './components/PageHeaderTitle';
import { documentReminderStatusItems, languageItems } from './core';

import './index.css';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const { currentUser } = useAuth();

  const [status, setStatus] = useState<DocumentReminderStatusEnum>(
    DocumentReminderStatusEnum.ACTIVE
  );

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setStatus(e.key as DocumentReminderStatusEnum);
  };

  const [modal, contextHolder] = Modal.useModal();

  const mainNavigator: MenuProps['items'] = [
    {
      key: '/',
      label: 'Văn bản',
      icon: <DatabaseOutlined />,
      onClick: () => navigate('/'),
    },
    {
      key: '/statistics',
      label: 'Thống kê',
      icon: <FundOutlined />,
      onClick: () => navigate('/statistics'),
    },
  ];

  const profileNavigator: MenuProps['items'] = [
    {
      key: '/profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: '/logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => confirmLogout(),
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
        defaultSelectedKeys={[location.pathname]}
        items={mainNavigator}
        className='flex-auto'
      />

      <div className='flex justify-between w-[78px]'>
        <Dropdown menu={{ items: languageItems }} placement='bottomRight' trigger={['click']}>
          <GlobalOutlined />
        </Dropdown>

        <Badge overflowCount={99} size='small'>
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

        <Dropdown menu={{ items: profileNavigator }} placement='bottomRight' trigger={['click']}>
          <UserOutlined title={currentUser?.username} />
        </Dropdown>
      </div>

      {contextHolder}
    </Header>
  );
};

export default PageHeader;
