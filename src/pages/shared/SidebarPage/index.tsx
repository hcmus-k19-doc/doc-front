import React, { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Layout } from 'antd';
import { useAuth } from 'components/AuthComponent';
import AdminMenu from 'components/DocMenu/AdminMenu';
import DirectorMenu from 'components/DocMenu/DirectorMenu';
import ExpertMenu from 'components/DocMenu/ExpertMenu';
import ManagerMenu from 'components/DocMenu/ManagerMenu';
import StaffMenu from 'components/DocMenu/StaffMenu';
import DocSuspenseComponent from 'components/DocSuspenseComponent';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import UserManagementPageWrapper from 'pages/admin/UserManagementPage';
import IncomingDocDetailPage from 'pages/shared/IncomingDocDetailPage';
import IncomingDocListPage from 'pages/shared/IncomingDocListPage';
import ReceiveIncomingDocPage from 'pages/staff/ReceiveIncomingDocPage';

import CreateOutgoingDocPage from '../CreateOutgoingDocPage';
import OutgoingDocDetailPage from '../OutgoingDocDetailPage';
import OutgoingDocListPage from '../OutgoingDocListPage';

import './index.css';

const { Content, Sider } = Layout;

const SidebarPage: React.FC<MenuProps> = () => {
  const { currentUser } = useAuth();
  const DocumentTypeManagementPage = lazy(() => import('pages/admin/DocumentTypeManagementPage'));
  const DepartmentManagementPage = lazy(() => import('pages/admin/DepartmentManagementPage'));
  const CalendarPage = lazy(() => import('pages/shared/CalendarPage'));

  const getRoutes = () => {
    switch (currentUser?.role) {
      case DocSystemRoleEnum.VAN_THU:
        return (
          <Routes>
            <Route path='/' element={<Navigate to='/list/docin/in-list' />} />
            <Route path='/in-list' element={<IncomingDocListPage />} />
            <Route path='/in-receive' element={<ReceiveIncomingDocPage />} />
            <Route path='/in-detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='/out-list' element={<OutgoingDocListPage />} />
            <Route path='/out-detail/:docId' element={<OutgoingDocDetailPage />} />
            <Route path='/out-create' element={<CreateOutgoingDocPage />} />
            <Route
              path='/calendar'
              element={
                <DocSuspenseComponent>
                  <CalendarPage />
                </DocSuspenseComponent>
              }
            />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.CHUYEN_VIEN:
        return (
          <Routes>
            <Route path='/' element={<Navigate to='/list/docin/in-list' />} />
            <Route path='/in-list' element={<IncomingDocListPage />} />
            <Route path='/in-detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='/out-list' element={<OutgoingDocListPage />} />
            <Route path='/out-detail/:docId' element={<OutgoingDocDetailPage />} />
            <Route path='/out-create' element={<CreateOutgoingDocPage />} />
            <Route
              path='/calendar'
              element={
                <DocSuspenseComponent>
                  <CalendarPage />
                </DocSuspenseComponent>
              }
            />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.TRUONG_PHONG:
        return (
          <Routes>
            <Route path='/' element={<Navigate to='/list/docin/in-list' />} />
            <Route path='/in-list' element={<IncomingDocListPage />} />
            <Route path='/in-detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='/out-list' element={<OutgoingDocListPage />} />
            <Route path='/out-detail/:docId' element={<OutgoingDocDetailPage />} />
            <Route path='/out-create' element={<CreateOutgoingDocPage />} />
            <Route
              path='/calendar'
              element={
                <DocSuspenseComponent>
                  <CalendarPage />
                </DocSuspenseComponent>
              }
            />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.HIEU_TRUONG:
        return (
          <Routes>
            <Route path='/' element={<Navigate to='/list/docin/in-list' />} />
            <Route path='/in-list' element={<IncomingDocListPage />} />
            <Route path='/in-detail/:docId' element={<IncomingDocDetailPage />} />
            <Route path='/out-list' element={<OutgoingDocListPage />} />
            <Route path='/out-detail/:docId' element={<OutgoingDocDetailPage />} />
            <Route path='/out-create' element={<CreateOutgoingDocPage />} />
            <Route
              path='/calendar'
              element={
                <DocSuspenseComponent>
                  <CalendarPage />
                </DocSuspenseComponent>
              }
            />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
      case DocSystemRoleEnum.DOC_ADMIN:
        return (
          <Routes>
            <Route path='/' element={<UserManagementPageWrapper />} />
            <Route
              path='/document-types'
              element={
                <DocSuspenseComponent>
                  <DocumentTypeManagementPage />
                </DocSuspenseComponent>
              }
            />
            <Route
              path='/departments'
              element={
                <DocSuspenseComponent>
                  <DepartmentManagementPage />
                </DocSuspenseComponent>
              }
            />
            <Route path='*' element={<Navigate to='/not-found' />} />
          </Routes>
        );
    }
  };

  const getMenus = (): JSX.Element => {
    switch (currentUser?.role as DocSystemRoleEnum) {
      case DocSystemRoleEnum.HIEU_TRUONG:
        return <DirectorMenu />;
      case DocSystemRoleEnum.TRUONG_PHONG:
        return <ManagerMenu />;
      case DocSystemRoleEnum.CHUYEN_VIEN:
        return <ExpertMenu />;
      case DocSystemRoleEnum.VAN_THU:
        return <StaffMenu />;
      case DocSystemRoleEnum.DOC_ADMIN:
        return <AdminMenu />;
    }
  };

  return (
    <>
      <Sider style={{ backgroundColor: 'white' }}>{getMenus()}</Sider>
      <Content className='px-5 py-2' style={{ minHeight: '70vh' }}>
        {getRoutes()}
      </Content>
    </>
  );
};

export default SidebarPage;
