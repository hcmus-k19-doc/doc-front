import React from 'react';
import { Col, Layout, Row, Space } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import PageHeader from 'components/PageHeader';
import { t } from 'i18next';

import ChangePasswordCard from './components/ChangePasswordCard';
import LogInfoCard from './components/LogInfoCard';
import UserInfoCard from './components/UserInfoCard';

function ProfilePage() {
  return (
    <Row>
      <Col span='10'>
        <Space direction='vertical' size='large'>
          <UserInfoCard />
          <ChangePasswordCard />
        </Space>
      </Col>
      <Col span='1' />
      <Col span='13'>
        <LogInfoCard />
      </Col>
    </Row>
  );
}

export default function ProfilePageWrapper() {
  return (
    <Layout>
      <PageHeader />
      <Content
        style={{
          padding: '0 50px',
          minHeight: '100vh',
        }}
        className='mt-12'>
        <div className='py-5'>
          <ProfilePage />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        {t('common.footer', { year: new Date().getFullYear() })}
      </Footer>
    </Layout>
  );
}
