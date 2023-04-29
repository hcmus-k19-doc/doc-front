import React from 'react';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const DirectorMenu = () => {
  const directorMenuItems: MenuProps['items'] = [
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

  const directorMenu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['inList'],
    defaultOpenKeys: ['docin'],
    items: directorMenuItems,
  };

  return (
    <Menu
      mode={directorMenu.mode}
      defaultSelectedKeys={directorMenu.defaultSelectedKeys}
      defaultOpenKeys={directorMenu.defaultOpenKeys}
      items={directorMenu.items}
    />
  );
};

export default DirectorMenu;
