import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

import '../menu.css';

const ManagerMenu = () => {
  const [openKey, setOpenKey] = useState('docin');
  const [current, setCurrent] = useState('in-list');

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/');

    if (location.pathname.includes('/docout')) {
      handleDocOutMenuKeys(path);
    } else {
      handleDocInMenuKeys(path);
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
      setCurrent('outList');
    } else {
      setCurrent(path[2]);
    }
  };

  const onSelect = ({ key }: { key: string }) => {
    setCurrent(key);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKey(keys[1]);
  };

  const managerMenuItems: MenuProps['items'] = [
    {
      key: 'docin',
      icon: <InboxOutlined />,
      label: t('main_page.menu.items.label'),

      children: [
        {
          key: 'in-list',
          label: t('main_page.menu.items.incoming_document_list'),
          onClick: () => {
            globalNavigate('/docin');
          },
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
          onClick: () => {
            globalNavigate('/docout/out-list');
          },
        },
        {
          key: 'out-create',
          label: t('main_page.menu.items.create_outgoing_document'),
          onClick: () => {
            globalNavigate('/docout/out-create');
          },
        },
      ],
    },
  ];

  const managerMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['in-list'],
    defaultOpenKeys: ['docin'],
    items: managerMenuItems,
  };

  return (
    <Menu
      mode={managerMenu.mode}
      openKeys={[openKey]}
      selectedKeys={[current]}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      items={managerMenu.items}
    />
  );
};

export default ManagerMenu;
