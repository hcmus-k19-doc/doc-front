import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  LoginForm,
  ProFormText,
  ProConfigProvider,
} from "@ant-design/pro-components";

import logo from "assets/logo.png";

import "./index.css";

const LoginPage: React.FC = () => {
  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: "white" }}>
        <LoginForm
          logo={logo}
          title="DOC"
          subTitle="Hệ thống phê duyệt và phát hành văn thư"
          submitter={{
            searchConfig: {
              submitText: "Đăng nhập",
            },
          }}
          onFinish={async (values) => {
            alert(JSON.stringify(values));
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={"prefixIcon"} />,
            }}
            placeholder={"Tên đăng nhập"}
            rules={[
              {
                required: true,
                message: "Hãy điền tên đăng nhập!",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={"prefixIcon"} />,
            }}
            placeholder={"Mật khẩu"}
            rules={[
              {
                required: true,
                message: "Hãy điền mật khẩu!",
              },
            ]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default LoginPage;
