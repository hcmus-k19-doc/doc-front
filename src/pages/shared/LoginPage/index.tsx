import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { Card } from 'antd';
import logoDoc from 'assets/icons/logo.png';
import logoHcmus from 'assets/icons/logo-hcmus.png';
import hcmusBg from 'assets/images/hcmus-bg.jpeg';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import securityService from 'services/SecurityService';
import userService from 'services/UserService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import './index.css';

const I18N_PREFIX = 'LOGIN';

const LoginPage: React.FC = () => {
  const { saveAuth, setCurrentUser } = useAuth();
  const [error, setError] = useState<string>();
  const alert = useSweetAlert();

  const handleOnFinish = async (values: Record<string, string>) => {
    try {
      const { data: token } = await securityService.login(values['username'], values['password']);
      saveAuth(token);
      const { data: user } = await userService.getCurrentUser();
      setCurrentUser(user);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        alert({
          icon: 'error',
          html: t(e.response?.data.message),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
          showConfirmButton: true,
        });
        setError(e.response?.data.message);
      } else {
        console.error(e);
      }
    }
  };

  const bgStyle = {
    backgroundImage: `url('${hcmusBg}')`,
    backgroundSize: 'cover',
  };

  const contentStyle = {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  };

  return (
    <div className='login-screen' style={bgStyle}>
      <div style={contentStyle} className='flex items-center justify-center content'>
        <Card className='flex items-center justify-center'>
          <ProConfigProvider hashed={false}>
            <div className='flex items-center justify-center'>
              <img src={logoHcmus} alt='logo-doc' className='logo mr-10' />
              <img src={logoDoc} alt='logo-hcmus' className='logo' />
            </div>
            <LoginForm
              submitter={{
                searchConfig: {
                  submitText: t(`${I18N_PREFIX}.SUBMITTER.SUBMIT_TEXT`),
                },
              }}
              onFinish={handleOnFinish}>
              <ProFormText
                name='username'
                hasFeedback={!!error}
                validateStatus={error ? 'error' : 'success'}
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className='prefixIcon' />,
                }}
                placeholder={t(`${I18N_PREFIX}.USERNAME.PLACEHOLDER`).toString()}
                rules={[
                  {
                    required: true,
                    message: t(`${I18N_PREFIX}.USERNAME.RULE_MESSAGE`).toString(),
                  },
                ]}
              />
              <ProFormText.Password
                name='password'
                hasFeedback={!!error}
                validateStatus={error ? 'error' : 'success'}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className='prefixIcon' />,
                }}
                placeholder={t(`${I18N_PREFIX}.PASSWORD.PLACEHOLDER`).toString()}
                rules={[
                  {
                    required: true,
                    message: t(`${I18N_PREFIX}.PASSWORD.RULE_MESSAGE`).toString(),
                  },
                ]}
              />
            </LoginForm>
          </ProConfigProvider>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
