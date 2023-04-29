import React from 'react';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const ManagerMenu = () => {
  const managerMenuItems: MenuProps['items'] = [
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

  const managerMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['inList'],
    defaultOpenKeys: ['docin'],
    items: managerMenuItems,
  };

  return (
    <Menu
      mode={managerMenu.mode}
      defaultSelectedKeys={managerMenu.defaultSelectedKeys}
      defaultOpenKeys={managerMenu.defaultOpenKeys}
      items={managerMenu.items}
    />
  );
};

export default ManagerMenu;
