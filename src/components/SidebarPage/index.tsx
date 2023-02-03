import React from "react";
import { Routes, Route } from "react-router-dom";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";

import CVDocInList from "pages/ChuyenVien/CVDocInList";

const { Content, Sider } = Layout;

const SidebarPage: React.FC<MenuProps> = (menu) => {
  return (
    <>
      <Sider style={{ backgroundColor: "white" }}>
        <Menu
          mode={menu.mode}
          defaultSelectedKeys={menu.defaultSelectedKeys}
          defaultOpenKeys={menu.defaultOpenKeys}
          items={menu.items}
        />
      </Sider>
      <Content className="px-5 py-3" style={{ minHeight: "70vh" }}>
        <Routes>
          <Route path="/" element={<CVDocInList />} />
          <Route path="/process" element={<div>VBDen xu ly</div>} />
        </Routes>
      </Content>
    </>
  );
};

export default SidebarPage;
