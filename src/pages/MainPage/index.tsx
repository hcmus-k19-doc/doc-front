import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, theme } from "antd";
import PageHeader from "components/PageHeader";
import SidebarPage from "components/SidebarPage";

const { Content, Footer } = Layout;

const sub: MenuProps["items"] = [
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
].map((icon, index) => {
  const key = String(index + 1);

  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `sub ${key}`,

    children: new Array(4).fill(null).map((_, j) => {
      const subKey: number = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

const menu: MenuProps = {
  mode: "inline",
  defaultSelectedKeys: ["1"],
  defaultOpenKeys: ["sub1"],
  items: sub,
};

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <BrowserRouter>
      <Layout>
        <PageHeader />
        <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
          <Breadcrumb className="mt-4 mb-4">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>MainPage</Breadcrumb.Item>
          </Breadcrumb>
          <Layout
            className="py-5"
            style={{ backgroundColor: colorBgContainer }}
          >
            <Routes>
              <Route path="/" element={<SidebarPage {...menu} />} />
              <Route path="/hello" element={<div>Hello</div>} />
            </Routes>
          </Layout>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          HCMUS &copy;2023 Document approval and publication system
        </Footer>
      </Layout>
    </BrowserRouter>
  );
};

export default MainPage;
