import React from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, theme } from "antd";
import PageHeader from "components/PageHeader";
import SidebarPage from "components/SidebarPage";

const { Content, Footer } = Layout;

// const sub: MenuProps["items"] = [
//   UserOutlined,
//   LaptopOutlined,
//   NotificationOutlined,
// ].map((icon, index) => {
//   const key = String(index + 1);

//   return {
//     key: `sub${key}`,
//     icon: React.createElement(icon),
//     label: `sub ${key}`,

//     children: new Array(4).fill(null).map((_, j) => {
//       const subKey: number = index * 4 + j + 1;
//       return {
//         key: subKey,
//         label: `option${subKey}`,
//       };
//     }),
//   };
// });

// [
//   UserOutlined,
//   LaptopOutlined,
//   NotificationOutlined,
// ].map((icon, index) => {
//   const key = String(index + 1);

//   return {
//     key: `sub${key}`,
//     icon: React.createElement(icon),
//     label: `sub ${key}`,

//     children: new Array(4).fill(null).map((_, j) => {
//       const subKey: number = index * 4 + j + 1;
//       return {
//         key: subKey,
//         label: `option${subKey}`,
//       };
//     }),
//   };
// });

const MainPage: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const sub: MenuProps["items"] = [
    {
      key: `vbden`,
      icon: React.createElement(ArrowDownOutlined),
      label: `Văn bản đến`,

      children: [
        {
          key: "den1",
          label: "Danh sách văn bản đến",
          onClick: () => {
            navigate("/docin");
          },
        },
        {
          key: "den2",
          label: "Xử lý văn bản đến",
          onClick: () => {
            navigate("/docin/process");
          },
        },
      ],
    },
    {
      key: `vbdi`,
      icon: React.createElement(ArrowUpOutlined),
      label: `Văn bản đi`,
      children: [
        {
          key: "di1",
          label: "Test",
        },
        {
          key: "di2",
          label: "Test",
        },
      ],
    },
    {
      key: `vbnb`,
      icon: React.createElement(InboxOutlined),
      label: `Văn bản nội bộ`,
      children: [
        {
          key: "nb1",
          label: "Test",
        },
        {
          key: "nb2",
          label: "Test",
        },
      ],
    },
  ];

  const menu: MenuProps = {
    mode: "inline",
    defaultSelectedKeys: ["den1"],
    defaultOpenKeys: ["vbden"],
    items: sub,
  };

  return (
    <Layout>
      <PageHeader />
      <Content style={{ padding: "0 50px", minHeight: "100vh" }}>
        <Breadcrumb className="mt-4 mb-4">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>MainPage</Breadcrumb.Item>
        </Breadcrumb>
        <Layout className="py-5" style={{ backgroundColor: colorBgContainer }}>
          <Routes>
            <Route path="/" element={<SidebarPage {...menu} />} />
            <Route path="/docin/*" element={<SidebarPage {...menu} />} />
            <Route path="/hello" element={<div>Hello</div>} />
          </Routes>
        </Layout>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        HCMUS &copy; 2023 Hệ thống phê duyệt và phát hành văn thư
      </Footer>
    </Layout>
  );
};

export default MainPage;
