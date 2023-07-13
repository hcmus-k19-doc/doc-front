import { Col, Layout, Row } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import PageHeader from 'components/PageHeader';
import { t } from 'i18next';

import ChangePasswordCard from './components/ChangePasswordCard';
import UserInfoCard from './components/UserInfoCard';

function ProfilePage() {
  return (
    <Row className='mb-5' gutter={[20, 0]}>
      <Col span={12}>
        <UserInfoCard />
      </Col>
      <Col span={12}>
        <ChangePasswordCard />
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
