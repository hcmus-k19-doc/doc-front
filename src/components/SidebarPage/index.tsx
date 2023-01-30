import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";

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
        Content
      </Content>
    </>
  );
};

export default SidebarPage;
