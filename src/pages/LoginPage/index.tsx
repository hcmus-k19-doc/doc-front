import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import logo from 'assets/logo.png';

import { useAuth } from '../../components/AuthComponent';
import { getToken } from '../../services/SecurityService';
import { getCurrentUser } from '../../services/UserService';

const LoginPage: React.FC = () => {
  const { saveAuth, setCurrentUser } = useAuth();

  const handleOnFinish = async (values: Record<string, string>) => {
    try {
      const { data: token } = await getToken(values['username'], values['password']);
      saveAuth(token);
      const { data: user } = await getCurrentUser();
      setCurrentUser(user);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          logo={logo}
          title='DOC'
          subTitle='Hệ thống phê duyệt và phát hành văn thư'
          submitter={{
            searchConfig: {
              submitText: 'Đăng nhập',
            },
          }}
          onFinish={handleOnFinish}>
          <ProFormText
            name='username'
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className='prefixIcon' />,
            }}
            placeholder='Tên đăng nhập'
            rules={[
              {
                required: true,
                message: 'Hãy điền tên đăng nhập!',
              },
            ]}
          />
          <ProFormText.Password
            name='password'
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className='prefixIcon' />,
            }}
            placeholder='Mật khẩu'
            rules={[
              {
                required: true,
                message: 'Hãy điền mật khẩu!',
              },
            ]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default LoginPage;
