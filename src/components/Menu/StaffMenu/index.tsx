import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, InboxOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const staffMenuItems: MenuProps['items'] = [
  {
    key: 'docin',
    icon: React.createElement(ArrowDownOutlined),
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
        label: t('MAIN_PAGE.MENU.ITEMS.PROCESSES_INCOMING_DOCUMENT'),
        onClick: () => {
          globalNavigate('/docin/process');
        },
      },
    ],
  },
  {
    key: 'docout',
    icon: React.createElement(ArrowUpOutlined),
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
  {
    key: 'docinternal',
    icon: React.createElement(InboxOutlined),
    label: t('MAIN_PAGE.MENU.ITEMS.INTERNAL_DOCUMENT'),
    children: [
      {
        key: 'internal1',
        label: 'Test',
      },
      {
        key: 'internal2',
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
