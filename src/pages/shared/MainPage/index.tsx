/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Breadcrumb, Layout, theme } from 'antd';
import PageHeader from 'components/PageHeader';
import { t } from 'i18next';
import ProcessingDetailsPage from 'pages/shared/ProcessingDetailsPage';
import SidebarPage from 'pages/shared/SidebarPage';

const { Content, Footer } = Layout;

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: '0 50px', minHeight: '100vh' }}>
        <div className='mt-4 mb-10'></div>
        <Layout className='py-5' style={{ backgroundColor: colorBgContainer }}>
          <Routes>
            <Route path='/*' element={<SidebarPage />} />
            <Route path='/docin/*' element={<SidebarPage />} />
            <Route path='/docout/*' element={<SidebarPage />} />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        </Layout>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {t('common.footer', { year: new Date().getFullYear() })}
      </Footer>
    </Layout>
  );
};

export default MainPage;
