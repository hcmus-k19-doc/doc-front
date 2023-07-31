import React, { useEffect, useState } from 'react';
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
import { Badge, Dropdown, Layout, Menu, MenuProps, Modal, Popover, Typography } from 'antd';
import logo from 'assets/icons/logo.png';
import { useAuth } from 'components/AuthComponent';
import NotificationHistory from 'components/NotificationHistory';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
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
const { Text } = Typography;

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [transferHistory, setTransferHistory] = useState<TransferHistoryDto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isTransferHistoryLoading, setIsTransferHistoryLoading] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

  const [modal, contextHolder] = Modal.useModal();

  const mainNavigator: MenuProps['items'] = [
    {
      key: '/',
      label: t('page_header.statistics'),
      icon: <FundOutlined />,
      onClick: () => navigate('/'),
    },
    {
      key: '/main',
      label: t('page_header.document'),
      icon: <DatabaseOutlined />,
      onClick: () => navigate('/main'),
    },
  ];

  const profileNavigator: MenuProps['items'] = [
    {
      key: '/profile',
      label: t('page_header.profile'),
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: '/logout',
      label: t('page_header.logout.title'),
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
    getUnreadNotificationCount();
  };

  const handleNotificationClose = () => {
    setShowNotifications(false);
  };

  const appendData = async () => {
    setIsTransferHistoryLoading(true);
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
    } finally {
      setIsTransferHistoryLoading(false);
    }
  };

  const getUnreadNotificationCount = async () => {
    try {
      const response = await userService.getUnreadNotificationCount();
      setUnreadNotificationCount(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    appendData();
    getUnreadNotificationCount();
  }, [unreadNotificationCount]);

  // useEffect(() => {
  //   appendData();
  // }, [showNotifications]);

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
      <div className='logo flex-none w-40 mt-4'>
        {currentUser?.role === DocSystemRoleEnum.DOC_ADMIN ? (
          <Link to='/main'>
            <img src={logo} style={{ width: '50%' }} alt='doc' />
          </Link>
        ) : (
          <Link to='/'>
            <img src={logo} style={{ width: '50%' }} alt='doc' />
          </Link>
        )}
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

      <div className='flex justify-between items-center min-w-[220px]'>
        <Dropdown menu={{ items: languageItems }} placement='bottomRight' trigger={['click']}>
          <GlobalOutlined />
        </Dropdown>

        <Badge count={unreadNotificationCount} overflowCount={10} size='small'>
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
                isTransferHistoryLoading={isTransferHistoryLoading}
                unreadNotificationCount={unreadNotificationCount}
                setUnreadNotificationCount={setUnreadNotificationCount}
              />
            }
            showArrow={false}>
            <BellOutlined onClick={handleNotificationClick} />
          </Popover>
        </Badge>

        <span>&#124;</span>

        <Dropdown menu={{ items: profileNavigator }} placement='bottom' trigger={['click']}>
          <div className='flex justify-between profile'>
            <UserOutlined />

            <Text
              strong
              style={{ color: PRIMARY_COLOR }}
              ellipsis={true}
              className='text-center ml-3'>
              {currentUser?.fullName}
            </Text>
          </div>
        </Dropdown>
      </div>
      {contextHolder}
    </Header>
  );
};

export default PageHeader;
