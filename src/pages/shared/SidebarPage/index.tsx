import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { useAuth } from 'components/AuthComponent';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import IncomingDocDetailPage from 'pages/shared/IncomingDocDetailPage';
import IncomingDocListPage from 'pages/shared/IncomingDocListPage';
import ProcessIncomingDocPage from 'pages/staff/ProcessIncomingDocPage';

const { Content, Sider } = Layout;

const SidebarPage: React.FC<MenuProps> = (menu) => {
  const { currentUser } = useAuth();

  const getRoutes = () => {
    switch (currentUser?.role as DocSystemRoleEnum) {
      case DocSystemRoleEnum.VAN_THU:
        return (
          <Routes>
            <Route path='/' element={<IncomingDocListPage />} />
            <Route path='/process' element={<ProcessIncomingDocPage />} />
            <Route path='/detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.CHUYEN_VIEN:
        return (
          <Routes>
            <Route path='/' element={<IncomingDocListPage />} />
            <Route path='/detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.TRUONG_PHONG:
        return (
          <Routes>
            <Route path='/' element={<IncomingDocListPage />} />
            <Route path='/detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.GIAM_DOC:
        return (
          <Routes>
            <Route path='/' element={<IncomingDocListPage />} />
            <Route path='/detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
    }
  };
  return (
    <>
      <Sider style={{ backgroundColor: 'white' }}>
        <Menu
          mode={menu.mode}
          defaultSelectedKeys={menu.defaultSelectedKeys}
          defaultOpenKeys={menu.defaultOpenKeys}
          items={menu.items}
        />
      </Sider>
      <Content className='px-5 py-2' style={{ minHeight: '70vh' }}>
        {getRoutes()}
      </Content>
    </>
  );
};

export default SidebarPage;
