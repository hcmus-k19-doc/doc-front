import React, { useEffect, useState } from 'react';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';
import { useLocation } from 'react-router-dom';
import { mapPathToKeyDocIn } from 'utils/MenuUtils';

const ExpertMenu = () => {
  const [openKey, setOpenKey] = useState('docin');
  const [current, setCurrent] = useState('inList');

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

  const expertMenuItems: MenuProps['items'] = [
    {
      key: 'docin',
      icon: <InboxOutlined />,
      label: t('MAIN_PAGE.MENU.ITEMS.LABEL'),

      children: [
        {
          key: 'inList',
          label: t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST'),
          onClick: () => {
            globalNavigate('/docin');
          },
        },
      ],
    },
    {
      key: 'docout',
      icon: <DeliveredProcedureOutlined />,
      label: t('MAIN_PAGE.MENU.ITEMS.OUTGOING_DOCUMENT'),
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

  const expertMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['inList'],
    defaultOpenKeys: ['docin'],
    items: expertMenuItems,
  };

  return (
    <Menu
      mode={expertMenu.mode}
      openKeys={[openKey]}
      selectedKeys={[current]}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      items={expertMenu.items}
    />
  );
};

export default ExpertMenu;
