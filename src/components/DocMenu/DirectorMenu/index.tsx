import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CalendarOutlined, DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

import '../menu.css';

const DirectorMenu = () => {
  const [openKey, setOpenKey] = useState('docin');
  const [current, setCurrent] = useState('in-list');

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/');

    if (location.pathname.includes('/docout')) {
      handleDocOutMenuKeys(path);
    } else if (location.pathname.includes('/docin')) {
      handleDocInMenuKeys(path);
    } else {
      handleCalendarMenuKeys();
    }
  }, [location]);

  const handleDocInMenuKeys = (path: string[]) => {
    setOpenKey('docin');
    if (!path[2]) {
      setCurrent('in-list');
    } else {
      setCurrent(path[2]);
    }
  };
  // TODO: handle docout menu keys
  const handleDocOutMenuKeys = (path: string[]) => {
    setOpenKey('docout');
    if (!path[2]) {
      setCurrent('out-list');
    } else {
      setCurrent(path[2]);
    }
  };

  function handleCalendarMenuKeys() {
    setOpenKey('calendar');
    setCurrent('calendar');
  }

  const onSelect = ({ key }: { key: string }) => {
    setCurrent(key);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKey(keys[1]);
  };

  const directorMenuItems: MenuProps['items'] = [
    {
      key: 'docin',
      icon: <InboxOutlined />,
      label: t('main_page.menu.items.label'),

      children: [
        {
          key: 'in-list',
          label: t('main_page.menu.items.incoming_document_list'),
          onClick: () => globalNavigate('/main/docin'),
        },
      ],
    },
    {
      key: 'docout',
      icon: <DeliveredProcedureOutlined />,
      label: t('main_page.menu.items.outgoing_document'),
      children: [
        {
          key: 'out-list',
          label: t('main_page.menu.items.outgoing_document_list'),
          onClick: () => globalNavigate('/main/docout/out-list'),
        },
        {
          key: 'out-create',
          label: t('main_page.menu.items.create_outgoing_document'),
          onClick: () => globalNavigate('/main/docout/out-create'),
        },
      ],
    },
    {
      key: 'calendar',
      icon: <CalendarOutlined />,
      label: t('main_page.menu.items.calendar'),
      onClick: () => globalNavigate('/main/calendar'),
    },
  ];

  const directorMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['in-list'],
    defaultOpenKeys: ['docin'],
    items: directorMenuItems,
  };

  return (
    <Menu
      mode={directorMenu.mode}
      openKeys={[openKey]}
      selectedKeys={[current]}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      items={directorMenu.items}
    />
  );
};

export default DirectorMenu;
