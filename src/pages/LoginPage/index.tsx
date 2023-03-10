import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import logo from 'assets/logo.png';
import axios from 'axios';
import { useAuth } from '../../components/AuthComponent';
import { getToken } from '../../services/SecurityService';
import { getCurrentUser } from '../../services/UserService';

const I18N_PREFIX = 'LOGIN';

const LoginPage: React.FC = () => {
  const { saveAuth, setCurrentUser } = useAuth();
  const { t } = useTranslation();
  const [error, setError] = useState<string>();

  const handleOnFinish = async (values: Record<string, string>) => {
    try {
      const { data: token } = await getToken(values['username'], values['password']);
      saveAuth(token);
      const { data: user } = await getCurrentUser();
      setCurrentUser(user);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data.message);
        console.error(e.response?.data.message);
      } else {
        console.error(e);
      }
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          logo={logo}
          title='DOC'
          subTitle={t(`${I18N_PREFIX}.SUBTITLE`)}
          submitter={{
            searchConfig: {
              submitText: t(`${I18N_PREFIX}.SUBMITTER.SUBMIT_TEXT`),
            },
          }}
          onFinish={handleOnFinish}>
          <ProFormText
            name='username'
            hasFeedback={!!error}
            help={t(error as string)}
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
            help={t(error as string)}
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
      </div>
    </ProConfigProvider>
  );
};

export default LoginPage;
