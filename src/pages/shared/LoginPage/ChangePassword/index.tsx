import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { Card } from 'antd';
import logoDoc from 'assets/icons/logo.png';
import logoHcmus from 'assets/icons/logo-hcmus.png';
import hcmusBg from 'assets/images/hcmus-bg.jpeg';
import { AxiosError } from 'axios';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import securityService from 'services/SecurityService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import DocFormValidators from 'shared/validators/DocFormValidators';
import { globalNavigate } from 'utils/RoutingUtils';

import './index.css';

const I18N_PREFIX = 'login';

const ChangePasswordPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location?.state) {
      if (location?.state?.username === undefined) {
        globalNavigate('/login');
      }
    } else {
      globalNavigate('/login');
    }
  }, [location]);

  const [error, setError] = useState<string>();
  const alert = useSweetAlert();

  const handleOnFinish = async (values: Record<string, string>) => {
    try {
      await securityService.updatePassword(
        values['username'],
        values['oldPassword'],
        values['newPassword'],
        values['confirmPassword']
      );
      alert({
        icon: 'success',
        html: t('login.password.change_password_success'),
        confirmButtonColor: PRIMARY_COLOR,
        showConfirmButton: false,
        timer: 4000,
      });
      globalNavigate('/login');
    } catch (e: AxiosError | any) {
      alert({
        icon: 'error',
        html: t('login.password.change_password_failed'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
        showConfirmButton: true,
      });
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

  const onBackToLoginPageClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    globalNavigate('/login');
  };

  return (
    <div className='login-screen' style={bgStyle}>
      <div style={contentStyle} className='flex items-center justify-center content'>
        <Card className='flex items-center justify-center' style={{ height: 'fit-content' }}>
          <ProConfigProvider hashed={false}>
            <div className='flex items-center justify-center'>
              <img src={logoHcmus} alt='logo-doc' className='logo mr-10' />
              <img src={logoDoc} alt='logo-hcmus' className='logo' />
            </div>
            <div className='text-center mb-3 mt-2'>
              <h1 className='text-2xl font-bold'> {t('user.detail.change_password')}</h1>
              <p className='text-base'>{t('user.password.need_changed')}</p>
            </div>
            <LoginForm
              submitter={{
                searchConfig: {
                  submitText: t('user.detail.change_password'),
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
                initialValue={location?.state?.username}
                disabled={true}
                placeholder={t(`${I18N_PREFIX}.username.placeholder`).toString()}
                rules={[
                  DocFormValidators.NoneBlankOrWhiteSpaceValidator(
                    `${t(`${I18N_PREFIX}.username.invalid_message`)}`
                  ),
                ]}
              />
              <ProFormText.Password
                name='oldPassword'
                hasFeedback={!!error}
                validateStatus={error ? 'error' : 'success'}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className='prefixIcon' />,
                }}
                placeholder={t('user.detail.old_password').toString()}
                rules={[
                  DocFormValidators.NoneBlankOrWhiteSpaceValidator(
                    `${t('user.password.required')}`
                  ),
                ]}
              />
              <ProFormText.Password
                name='newPassword'
                hasFeedback={!!error}
                validateStatus={error ? 'error' : 'success'}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className='prefixIcon' />,
                }}
                dependencies={['oldPassword']}
                validateFirst
                placeholder={t('user.detail.new_password').toString()}
                rules={[
                  ...DocFormValidators.PasswordValidators(),
                  ({ getFieldValue }: any) => ({
                    validator(_, value: any) {
                      if (!value || getFieldValue('oldPassword') !== value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t('user.detail.password_not_change').toString())
                      );
                    },
                  }),
                ]}
              />
              <ProFormText.Password
                name='confirmPassword'
                hasFeedback={!!error}
                validateStatus={error ? 'error' : 'success'}
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className='prefixIcon' />,
                }}
                dependencies={['newPassword']}
                placeholder={t('user.detail.confirm_password').toString()}
                validateFirst
                rules={[
                  ...DocFormValidators.PasswordValidators(),
                  ({ getFieldValue }: any) => ({
                    validator(_, value: any) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t('user.detail.password_not_match').toString())
                      );
                    },
                  }),
                ]}
              />
            </LoginForm>
            <div className='text-center'>
              <a className='back-to-login' onClick={(e) => onBackToLoginPageClick(e)}>
                <ArrowLeftOutlined className='mr-1' />
                {t('login.password.back_to_login')}
              </a>
            </div>
          </ProConfigProvider>
        </Card>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
