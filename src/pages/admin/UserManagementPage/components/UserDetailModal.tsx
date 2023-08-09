import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Button, Col, Divider, Form, FormInstance, Input, Modal, Row, Select } from 'antd';
import { t } from 'i18next';
import { DepartmentDto, DocSystemRoleEnum } from 'models/doc-main-models';
import { ALL_SYSTEM_ROLES } from 'models/models';
import AdminService from 'services/AdminService';
import { useSelectionDepartmentRes } from 'shared/hooks/DepartmentQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { useUserMutation } from 'shared/hooks/UserQuery';

import { UserTableRowDataType } from '../core/models';

interface Props {
  form: FormInstance;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  isEditMode?: boolean;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default function UserDetailModal({
  form,
  isModalOpen,
  handleOk,
  handleCancel,
  isEditMode,
  loading,
  setLoading,
}: Props) {
  const { data: departments } = useSelectionDepartmentRes();
  const userMutation = useUserMutation();
  const showAlert = useSweetAlert();

  async function handleResetPassword(userId: number) {
    setLoading(true);
    try {
      await AdminService.resetUserPassword(userId);
      showAlert({
        icon: 'success',
        html: t('user_management.user_function.reset_password.success'),
        showConfirmButton: true,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const confirm = () => {
    Modal.confirm({
      title: t('user_management.user_function.reset_password.title'),
      content: t('user_management.user_function.reset_password.content'),
      onOk() {
        const userId = form.getFieldValue('id');
        handleResetPassword(userId);
      },
    });
  };

  const renderButtons = (): ReactNode => {
    const buttons = [];
    if (isEditMode) {
      buttons.push(
        <Button
          key='0'
          type='primary'
          onClick={confirm}
          className='danger-button'
          loading={loading}>
          {t('login.password.reset_password')}
        </Button>
      );
    }
    buttons.push(
      <Button key='1' onClick={handleCancel} loading={loading}>
        {t('common.modal.cancel_text')}
      </Button>,
      <Button key='2' type='primary' onClick={handleOk} loading={loading}>
        {t('common.modal.ok_text')}
      </Button>
    );
    return buttons;
  };

  return (
    <Modal
      title={t('user.detail.title')}
      onCancel={handleCancel}
      open={isModalOpen}
      footer={renderButtons()}>
      <Divider />
      <Row className='mt-5'>
        <Form
          form={form}
          onFinish={(values: UserTableRowDataType) => {
            userMutation.mutate(values);
          }}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout='horizontal'
          className='w-[400px]'>
          <Col>
            <Form.Item label={t('user.detail.id')} name='id'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('user.detail.username')}
              name='username'
              rules={[{ required: true, message: `${t('user.detail.username_required')}` }]}>
              <Input disabled={isEditMode} />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('user.detail.email')}
              name='email'
              rules={[
                {
                  required: true,
                  message: `${t('user.detail.email_invalid')}`,
                  type: 'email',
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('user.detail.full_name')}
              name='fullName'
              rules={[{ required: true, message: `${t('user.detail.full_name_required')}` }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('user.detail.role')}
              name='role'
              rules={[{ required: true, message: `${t('user.detail.role_required')}` }]}>
              <Select>
                {ALL_SYSTEM_ROLES.map((role: DocSystemRoleEnum) => (
                  <Select.Option key={role} value={role}>
                    {t(`user.role.${role}`)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('user.detail.role_title')}
              name='roleTitle'
              rules={[
                {
                  required: true,
                  message: `${t('user.detail.role_title_invalid')}`,
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('user.detail.department')}
              name='departmentId'
              rules={[{ required: true, message: `${t('user.detail.department_required')}` }]}>
              <Select>
                {departments?.map((department: DepartmentDto) => (
                  <Select.Option key={department.id} value={department.id}>
                    {department.departmentName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Modal>
  );
}
