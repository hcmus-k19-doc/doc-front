import React from 'react';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const StaffMenu = () => {
  const staffMenuItems: MenuProps['items'] = [
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
        {
          key: 'inProcess',
          label: t('MAIN_PAGE.MENU.ITEMS.RECEIVING_INCOMING_DOCUMENT'),
          onClick: () => {
            globalNavigate('/docin/receive');
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

  const staffMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['inList'],
    defaultOpenKeys: ['docin'],
    items: staffMenuItems,
  };

  return (
    <Menu
      mode={staffMenu.mode}
      defaultSelectedKeys={staffMenu.defaultSelectedKeys}
      defaultOpenKeys={staffMenu.defaultOpenKeys}
      items={staffMenu.items}
    />
  );
};

export default StaffMenu;
