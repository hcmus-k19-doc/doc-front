/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Breadcrumb, Layout, MenuProps, theme } from 'antd';
import { useAuth } from 'components/AuthComponent';
import PageHeader from 'components/PageHeader';
import { DocSystemRoleEnum, UserDto } from 'models/doc-main-models';
import SidebarPage from 'pages/shared/SidebarPage';
import { getMenus } from 'utils/MenuUtils';

const { Content, Footer } = Layout;

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // const { currentUser } = useAuth();
  // const [menu] = React.useState<MenuProps>(getMenus(currentUser?.role as DocSystemRoleEnum));

  // temporarily testing
  const currentUser: UserDto = {
    id: 1,
    version: 1,
    username: 'admin',
    email: 'abc@gmail.com',
    fullName: 'admin',
    role: DocSystemRoleEnum.STAFF,
  };

  const [menu] = React.useState<MenuProps>(getMenus(currentUser?.role as DocSystemRoleEnum));

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
