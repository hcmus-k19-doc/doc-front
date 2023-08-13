import React, { useState } from 'react';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { Card } from 'antd';
import logoDoc from 'assets/icons/logo.png';
import logoHcmus from 'assets/icons/logo-hcmus.png';
import hcmusBg from 'assets/images/hcmus-bg.jpeg';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import securityService from 'services/SecurityService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import DocFormValidators from 'shared/validators/DocFormValidators';
import { globalNavigate } from 'utils/RoutingUtils';

import './index.css';

const I18N_PREFIX = 'login';

const ForgotPasswordPage: React.FC = () => {
  const [error, setError] = useState<string>();
  const alert = useSweetAlert();

  const handleOnFinish = async (values: Record<string, string>) => {
    try {
      const response = await securityService.forgotPassword(values['email']);
      if (response) {
        alert({
          icon: 'success',
          html: t(`${I18N_PREFIX}.password.send_request_success`),
          confirmButtonColor: PRIMARY_COLOR,
          showConfirmButton: false,
          timer: 4000,
        });
        globalNavigate('/login');
      }
    } catch (e) {
      alert({
        icon: 'error',
        html: t(`${I18N_PREFIX}.password.send_request_failed`),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
        showConfirmButton: true,
      });
      console.error(e);
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
        <Card className='flex items-center justify-center'>
          <ProConfigProvider hashed={false}>
            <div className='flex items-center justify-center'>
              <img src={logoHcmus} alt='logo-doc' className='logo mr-10' />
              <img src={logoDoc} alt='logo-hcmus' className='logo' />
            </div>
            <div className='text-center mb-3 mt-2'>
              <h1 className='text-2xl font-bold'> {t('login.password.forgot_password')}</h1>
              <p className='text-base'>{t('login.password.forgot_password_description')}</p>
            </div>
            <LoginForm
              submitter={{
                searchConfig: {
                  submitText: t(`${I18N_PREFIX}.submitter.send_request`),
                },
              }}
              onFinish={handleOnFinish}>
              <ProFormText
                name='email'
                hasFeedback={!!error}
                validateStatus={error ? 'error' : 'success'}
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className='prefixIcon' />,
                }}
                placeholder={t(`${I18N_PREFIX}.email.placeholder`).toString()}
                validateFirst
                rules={[
                  DocFormValidators.NoneBlankOrWhiteSpaceValidator(
                    `${t(`${I18N_PREFIX}.email.none_whitespace`)}`
                  ),
                  {
                    required: true,
                    message: `${t(`${I18N_PREFIX}.email.invalid_message`)}`,
                    type: 'email',
                  },
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

export default ForgotPasswordPage;
