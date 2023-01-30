import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import logo from "assets/logo.png";

import { Link, useNavigate } from "react-router-dom";

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
    </Header>
  );
};

export default PageHeader;
