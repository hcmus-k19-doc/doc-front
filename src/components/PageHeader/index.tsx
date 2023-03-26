import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  BellOutlined,
  ExclamationCircleOutlined,
  GlobalOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { MenuProps, Modal } from 'antd';
import { Badge, Dropdown, Layout, Menu, Space } from 'antd';
import logo from 'assets/icons/logo.png';
import { useAuth } from 'components/AuthComponent';

import './index.css';

const { Header } = Layout;

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

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: t('PAGE_HEADER.LANGUAGES.EN'),
    },
    {
      key: '2',
      label: t('PAGE_HEADER.LANGUAGES.VI'),
    },
  ];

  const confirmLogout = () => {
    modal.confirm({
      title: t('PAGE_HEADER.logout.modal.title'),
      icon: <ExclamationCircleOutlined />,
      content: t('PAGE_HEADER.logout.modal.content'),
      okText: t('PAGE_HEADER.logout.modal.ok_text'),
      cancelText: t('PAGE_HEADER.logout.modal.cancel_text'),
      onOk: () => {
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
      <Dropdown menu={{ items }} placement='bottomRight'>
        <Space>
          <GlobalOutlined />
        </Space>
      </Dropdown>

      <Badge count={5} overflowCount={99} size='small' className='ml-5'>
        <BellOutlined />
      </Badge>

      <LogoutOutlined className='ml-5' onClick={confirmLogout} />
      {contextHolder}
    </Header>
  );
};

export default PageHeader;
