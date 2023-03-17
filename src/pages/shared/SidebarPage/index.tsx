import React from 'react';
import { Route, Routes } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import ExpertDocInListPage from 'pages/shared/IncomingDocListPage';
import ProcessIncomingDocPage from 'pages/staff/ProcessIncomingDocPage';

const { Content, Sider } = Layout;

const SidebarPage: React.FC<MenuProps> = (menu) => {
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
        <Routes>
          <Route path='/' element={<ExpertDocInListPage />} />
          <Route path='/process' element={<ProcessIncomingDocPage />} />
        </Routes>
      </Content>
    </>
  );
};

export default SidebarPage;
