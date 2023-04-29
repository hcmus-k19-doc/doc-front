import React from 'react';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const managerMenuItems: MenuProps['items'] = [
  {
    key: 'docin',
    icon: <InboxOutlined />,
    label: t('MAIN_PAGE.MENU.ITEMS.LABEL'),

    children: [
      {
        key: 'in1',
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
  defaultSelectedKeys: ['in1'],
  defaultOpenKeys: ['docin'],
  items: managerMenuItems,
};

export default managerMenu;
