import React from 'react';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const ExpertMenu = () => {
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
      defaultSelectedKeys={expertMenu.defaultSelectedKeys}
      defaultOpenKeys={expertMenu.defaultOpenKeys}
      items={expertMenu.items}
    />
  );
};

export default ExpertMenu;
