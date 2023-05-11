import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { mapPathToKeyDocIn } from 'utils/MenuUtils';
import { globalNavigate } from 'utils/RoutingUtils';

const ManagerMenu = () => {
  const [openKey, setOpenKey] = useState('docin');
  const [current, setCurrent] = useState('inList');

  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split('/');

    if (path[1] === 'docout') {
      handleDocOutMenuKeys(path);
    } else {
      handleDocInMenuKeys(path);
    }
  }, [location]);

  const handleDocInMenuKeys = (path: string[]) => {
    setOpenKey('docin');
    if (!path[2]) {
      setCurrent('inList');
    } else {
      if (path[2] === 'detail') {
        setOpenKey('');
      }
      setCurrent(mapPathToKeyDocIn(path[2]));
    }
  };

  // TODO: handle docout menu keys
  const handleDocOutMenuKeys = (path: string[]) => {
    setOpenKey('docout');
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
          key: 'inList',
          label: t('main_page.menu.items.incoming_document_list'),
          onClick: () => {
            globalNavigate('/docin');
          },
        },
        {
          key: 'inReceive',
          label: t('main_page.menu.items.receiving_incoming_document'),
          onClick: () => {
            globalNavigate('/docin/receive');
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
          key: 'out1',
          label: 'Test',
        },
        {
          key: 'out2',
          label: 'Test',
        },
      ],
    },
  ];

  const managerMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['inList'],
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
