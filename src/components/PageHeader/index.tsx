import React, { useEffect, useState } from 'react';
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
import NotificationHistory from 'components/NotificationHistory';
import {
  DocSystemRoleEnum,
  TransferHistoryDto,
  TransferHistorySearchCriteriaDto,
} from 'models/doc-main-models';
import securityService from 'services/SecurityService';
import userService from 'services/UserService';
import * as authUtils from 'utils/AuthUtils';

import { ContainerHeight, defaultPageSize, joinArrayWithoutDuplicate } from './core/common';
import { languageItems } from './core';

import './index.css';

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [transferHistory, setTransferHistory] = useState<TransferHistoryDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    appendData();
    setShowNotifications(true);
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const appendData = async () => {
    try {
      const searchCriteria: TransferHistorySearchCriteriaDto = {
        userId: currentUser?.id || -1,
      };
      const response = await userService.getTransferHistory(
        searchCriteria,
        currentPage,
        defaultPageSize
      );

      if (response.length > 0) {
        setTransferHistory(joinArrayWithoutDuplicate(transferHistory, response));
      } else {
        setCurrentPage(1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    appendData();
  }, []);

  const onScroll = (e: React.UIEvent<HTMLElement, UIEvent>) => {
    if (e.currentTarget.scrollHeight - e.currentTarget.scrollTop === ContainerHeight) {
      // move the scrollbar up in order to continue scroll
      e.currentTarget.scrollTop -= 12;
      appendData();
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };

  return (
    <Header
      className='header flex items-center justify-between border-b-2'
      style={{ backgroundColor: 'white' }}>
      <div className='logo flex-none w-40'>
        <Link to='/'>
          <img src={logo} style={{ width: '50%' }} alt='doc' />
        </Link>
      </div>

      {currentUser?.role !== DocSystemRoleEnum.DOC_ADMIN && (
        <Menu
          theme='light'
          mode='horizontal'
          defaultSelectedKeys={[location.pathname]}
          items={mainNavigator}
          className='flex-auto'
        />
      )}

      <div className='flex justify-between w-[78px]'>
        <Dropdown menu={{ items: languageItems }} placement='bottomRight' trigger={['click']}>
          <GlobalOutlined />
        </Dropdown>

        <Badge
          count={transferHistory.length > 0 ? transferHistory.length : undefined}
          overflowCount={transferHistory.length > 0 ? transferHistory.length : undefined}
          size='small'>
          <Popover
            overlayInnerStyle={{ width: '700px' }}
            placement='bottomRight'
            trigger='click'
            open={showNotifications}
            onOpenChange={setShowNotifications}
            content={
              <NotificationHistory
                onScroll={onScroll}
                notifications={transferHistory}
                handleNotificationClose={handleNotificationClose}
              />
            }
            showArrow={false}>
            <BellOutlined onClick={handleNotificationClick} />
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
