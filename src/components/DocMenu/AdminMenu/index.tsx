import React, { useState } from 'react';
import {
  BankOutlined,
  EditOutlined,
  FileTextOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

import '../menu.css';

const AdminMenu = () => {
  const [openKey, setOpenKey] = useState<string[]>(['admin-management']);
  const [current, setCurrent] = useState<string>('users');

  const onSelect = ({ key }: { key: string }) => {
    setCurrent(key);
  };

  const onOpenChange = (keys: string[]) => {
    setOpenKey(keys);
  };

  const adminMenuItems: MenuProps['items'] = [
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
            globalNavigate('/main/');
          },
        },
        {
          key: 'document-types',
          label: t('main_page.menu.items.document_types'),
          icon: <FileTextOutlined />,
          onClick: () => {
            globalNavigate('/main/document-types');
          },
        },
        {
          key: 'departments',
          label: t('main_page.menu.items.departments'),
          icon: <TeamOutlined />,
          onClick: () => {
            globalNavigate('/main/departments');
          },
        },
        {
          key: 'distribution_organizations',
          label: t('main_page.menu.items.distribution_organizations'),
          icon: <BankOutlined />,
          onClick: () => {
            globalNavigate('/main/distribution_organizations');
          },
        },
      ],
    },
  ];

  const adminMenuProps: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['users'],
    defaultOpenKeys: ['admin-management'],
    items: adminMenuItems,
  };

  return (
    <Menu
      mode={adminMenuProps.mode}
      openKeys={openKey}
      selectedKeys={[current]}
      onSelect={onSelect}
      onOpenChange={onOpenChange}
      items={adminMenuProps.items}
      defaultOpenKeys={adminMenuProps.defaultOpenKeys}
    />
  );
};

export default AdminMenu;
