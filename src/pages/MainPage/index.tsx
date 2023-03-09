import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ArrowDownOutlined, ArrowUpOutlined, InboxOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, theme } from 'antd';
import PageHeader from 'components/PageHeader';
import SidebarPage from 'components/SidebarPage';
import LoginPage from 'pages/LoginPage';

const { Content, Footer } = Layout;

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const sub: MenuProps['items'] = [
    {
      key: `docin`,
      icon: React.createElement(ArrowDownOutlined),
      label: t('MAIN_PAGE.MENU.ITEMS.LABEL'),

      children: [
        {
          key: 'in1',
          label: t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST'),
          onClick: () => {
            navigate('/docin');
          },
        },
        {
          key: 'in2',
          label: t('MAIN_PAGE.MENU.ITEMS.PROCESSES_INCOMING_DOCUMENT'),
          onClick: () => {
            navigate('/docin/process');
          },
        },
      ],
    },
    {
      key: `docout`,
      icon: React.createElement(ArrowUpOutlined),
      label: t(`MAIN_PAGE.MENU.ITEMS.OUTGOING_DOCUMENT`),
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
      key: `docinternal`,
      icon: React.createElement(InboxOutlined),
      label: t(`MAIN_PAGE.MENU.ITEMS.INTERNAL_DOCUMENT`),
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

  const menu: MenuProps = {
    mode: 'inline',
    defaultSelectedKeys: ['in1'],
    defaultOpenKeys: ['docin'],
    items: sub,
  };

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: '0 50px', minHeight: '100vh' }}>
        <Breadcrumb className='mt-4 mb-4'>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>MainPage</Breadcrumb.Item>
        </Breadcrumb>
        <Layout className='py-5' style={{ backgroundColor: colorBgContainer }}>
          <Routes>
            <Route path='/' element={<SidebarPage {...menu} />} />
            <Route path='/docin/*' element={<SidebarPage {...menu} />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/hello' element={<div>Hello</div>} />
          </Routes>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        HCMUS &copy; 2023 Hệ thống phê duyệt và phát hành văn thư
      </Footer>
    </Layout>
  );
};

export default MainPage;
