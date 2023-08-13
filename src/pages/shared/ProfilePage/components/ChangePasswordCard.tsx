import { Button, Card, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { AxiosError } from 'axios';
import { useAuth } from 'components/AuthComponent';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import userService from 'services/UserService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import DocFormValidators from '../../../../shared/validators/DocFormValidators';

import '../index.css';

export default function ChangePasswordCard() {
  const [form] = useForm();
  const { logout } = useAuth();

  const rules = [
    {
      required: true,
      message: `${t('user.detail.password_required')}`,
    },
  ];

  async function handleOnFinish(values: Record<string, string>) {
    const showAlert = useSweetAlert();

    try {
      await userService.updatePassword(
        values.oldPassword,
        values.confirmPassword,
        values.newPassword
      );

      showAlert({
        icon: 'success',
        html: t('user.detail.change_password_success'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
        showConfirmButton: true,
      });

      form.resetFields();
      logout();
    } catch (e: AxiosError | any) {
      const errorMessage = e instanceof AxiosError ? e.response?.data.message : e.message;
      showAlert({
        icon: 'error',
        html: t(errorMessage),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
        showConfirmButton: true,
      });
    }
  }

  return (
    <Card className='shadow-xl drop-shadow-2xl rounded-lg ant-card'>
      <Form layout='vertical' onFinish={handleOnFinish} form={form}>
        <Form.Item
          label={t('user.detail.old_password')}
          name='oldPassword'
          rules={DocFormValidators.PasswordValidators()}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t('user.detail.new_password')}
          name='newPassword'
          dependencies={['oldPassword']}
          rules={[
            ...DocFormValidators.PasswordValidators(),
            ({ getFieldValue }: any) => ({
              validator(_, value: any) {
                if (!value || getFieldValue('oldPassword') !== value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('user.detail.password_not_change').toString()));
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={t('user.detail.confirm_password')}
          name='confirmPassword'
          dependencies={['newPassword']}
          rules={[
            ...DocFormValidators.PasswordValidators(),
            ({ getFieldValue }: any) => ({
              validator(_, value: any) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t('user.detail.password_not_match').toString()));
              },
            }),
          ]}>
          <Input.Password />
        </Form.Item>

        <Button type='primary' htmlType='submit'>
          {t('user.detail.change_password')}
        </Button>
      </Form>
    </Card>
  );
}
