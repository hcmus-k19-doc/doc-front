import React, { useState } from 'react';
import { ArrowRightOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
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
import DocFormValidators from 'shared/validators/DocFormValidators';
import { globalNavigate } from 'utils/RoutingUtils';

import './index.css';

const I18N_PREFIX = 'login';

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
        if (e?.response?.data?.message === 'user.password.need_changed') {
          globalNavigate('/change-password', {
            state: {
              username: values['username'],
            },
          });
          return;
        } else {
          alert({
            icon: 'error',
            html: t(e.response?.data.message),
            confirmButtonColor: PRIMARY_COLOR,
            confirmButtonText: 'OK',
            showConfirmButton: true,
          });
          setError(e.response?.data.message);
        }
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
  };

  const onForgotPasswordClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    globalNavigate('/forgot-password');
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
                  submitText: t(`${I18N_PREFIX}.submitter.submit_text`),
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
                placeholder={t(`${I18N_PREFIX}.username.placeholder`).toString()}
                rules={[
                  DocFormValidators.NoneBlankOrWhiteSpaceValidator(
                    `${t(`${I18N_PREFIX}.username.invalid_message`)}`
                  ),
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
                placeholder={t(`${I18N_PREFIX}.password.placeholder`).toString()}
                rules={[
                  DocFormValidators.NoneBlankOrWhiteSpaceValidator(
                    `${t('user.password.required')}`
                  ),
                ]}
              />
              <div>
                <a className='forgot-password' onClick={(e) => onForgotPasswordClick(e)}>
                  {`${t('login.password.forgot_password')}?`}
                  <ArrowRightOutlined className='ml-1' />
                </a>
              </div>
            </LoginForm>
          </ProConfigProvider>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
