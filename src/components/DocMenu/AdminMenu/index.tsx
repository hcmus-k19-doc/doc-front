import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { EditOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { mapPathToKeyDocIn } from 'utils/MenuUtils';
import { globalNavigate } from 'utils/RoutingUtils';

const AdminMenu = () => {
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

  const directorMenuItems: MenuProps['items'] = [
    {
      key: 'admin-management',
      icon: <EditOutlined />,
      label: t('main_page.menu.items.admin_management'),

      children: [
        {
          key: 'users',
          label: t('main_page.menu.items.users'),
          icon: <UserOutlined />,
          onClick: () => {
            globalNavigate('/');
          },
        },
        {
          key: 'document-types',
          label: t('main_page.menu.items.document_types'),
          icon: <FileTextOutlined />,
          onClick: () => {
            globalNavigate('/document-types');
          },
        },
      ],
    },
  ];

  const directorMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['inList'],
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

export default AdminMenu;
