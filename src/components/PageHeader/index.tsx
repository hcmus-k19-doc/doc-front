import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Badge, Dropdown, Layout, Menu, MenuProps, Modal, Popover, Space, Typography } from 'antd';
import logo from 'assets/icons/logo.png';
import { useAuth } from 'components/AuthComponent';
import securityService from 'services/SecurityService';
import * as authUtils from 'utils/AuthUtils';

import ReminderCalendar from './components/ReminderCalendar';

import './index.css';

const { Header } = Layout;
const { Title } = Typography;

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();

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

      <Badge count={5} overflowCount={99} size='small' className='ml-5'>
        <Popover
          overlayInnerStyle={{ width: '700px' }}
          placement='bottomRight'
          title={() => (
            <Title className='ml-3 mt-3' level={4}>
              {t('page_header.reminder')}
            </Title>
          )}
          content={ReminderCalendar}
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
