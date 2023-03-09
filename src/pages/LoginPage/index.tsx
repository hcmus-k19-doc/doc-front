import React from 'react';
import { useTranslation } from 'react-i18next';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import logo from 'assets/icons/logo.png';
import { useAuth } from 'components/AuthComponent';
import { getToken } from 'services/SecurityService';
import { getCurrentUser } from 'services/UserService';

const I18N_PREFIX = 'LOGIN';

const LoginPage: React.FC = () => {
  const { saveAuth, setCurrentUser } = useAuth();
  const { t } = useTranslation();

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
          subTitle={t(`${I18N_PREFIX}.SUBTITLE`)}
          submitter={{
            searchConfig: {
              submitText: t(`${I18N_PREFIX}.SUBMITTER.SUBMIT_TEXT`),
            },
          }}
          onFinish={handleOnFinish}>
          <ProFormText
            name='username'
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className='prefixIcon' />,
            }}
            placeholder={t(`${I18N_PREFIX}.USERNAME.PLACEHOLDER`) as string}
            rules={[
              {
                required: true,
                message: t(`${I18N_PREFIX}.USERNAME.RULE_MESSAGE`) as string,
              },
            ]}
          />
          <ProFormText.Password
            name='password'
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className='prefixIcon' />,
            }}
            placeholder={t(`${I18N_PREFIX}.PASSWORD.PLACEHOLDER`) as string}
            rules={[
              {
                required: true,
                message: t(`${I18N_PREFIX}.PASSWORD.RULE_MESSAGE`) as string,
              },
            ]}
          />
        </LoginForm>
      </div>
    </ProConfigProvider>
  );
};

export default LoginPage;
