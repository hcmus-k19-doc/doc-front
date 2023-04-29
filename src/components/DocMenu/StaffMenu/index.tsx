import React from 'react';
import { MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';
import { DeliveredProcedureOutlined, InboxOutlined } from '@ant-design/icons';

const staffMenuItems: MenuProps['items'] = [
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
      {
        key: 'in2',
        label: t('MAIN_PAGE.MENU.ITEMS.RECEIVING_INCOMING_DOCUMENT'),
        onClick: () => {
          globalNavigate('/docin/process');
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
  defaultSelectedKeys: ['in1'],
  defaultOpenKeys: ['docin'],
  items: staffMenuItems,
};

export default staffMenu;
