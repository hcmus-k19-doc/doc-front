import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import logo from "assets/logo.png";

const { Header } = Layout;

const items1: MenuProps["items"] = ["1", "2", "3"].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const PageHeader: React.FC = () => {
  return (
    <Header
      className="header flex items-center justify-center border-b-2"
      style={{ backgroundColor: "white" }}
    >
      <div className="logo flex-none w-40">
        <img src={logo} style={{ width: "50%" }} alt="doc" />
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
