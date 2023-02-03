import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Layout, Menu } from "antd";
import {
  BellOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Badge } from "antd";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

import "./index.css";
import logo from "assets/logo.png";

const { Header } = Layout;

const PageHeader: React.FC = () => {
  const navigate = useNavigate();

  const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
    key,
    label: `nav ${key}`,
    onClick: () => {
      navigate("/hello");
    },
  }));

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: "English",
    },
    {
      key: "2",
      label: "Vietnamese",
    },
  ];

  return (
    <Header
      className="header flex items-center justify-center border-b-2"
      style={{ backgroundColor: "white" }}
    >
      <div className="logo flex-none w-40">
        <Link to="/">
          <img src={logo} style={{ width: "50%" }} alt="doc" />
        </Link>
      </div>
      <Menu
        theme="light"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        items={items1}
        className="flex-auto"
      />
      <Dropdown menu={{ items }} placement="bottomRight">
        <Space>
          <GlobalOutlined />
        </Space>
      </Dropdown>

      <Badge count={5} overflowCount={99} size="small" className="ml-5">
        <BellOutlined />
      </Badge>

      <LogoutOutlined className="ml-5" />
    </Header>
  );
};

export default PageHeader;
