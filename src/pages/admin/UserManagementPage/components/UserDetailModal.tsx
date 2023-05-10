import React from 'react';
import { Col, Divider, Form, FormInstance, Input, Modal, Row, Select } from 'antd';
import { t } from 'i18next';
import { DepartmentDto, DocSystemRoleEnum } from 'models/doc-main-models';
import { ALL_SYSTEM_ROLES } from 'models/models';
import { useSelectionDepartmentRes } from 'shared/hooks/DepartmentQuery';
import { useUserMutation } from 'shared/hooks/UserQuery';

import { UserTableRowDataType } from '../core/models';

interface Props {
  form: FormInstance;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  isEditMode?: boolean;
}

export default function UserDetailModal({
  form,
  isModalOpen,
  handleOk,
  handleCancel,
  isEditMode,
}: Props) {
  const { data: departments } = useSelectionDepartmentRes();
  const userMutation = useUserMutation();

  return (
    <Modal
      title={t('user.detail.title')}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
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
              <Input />
            </Form.Item>
          </Col>
          <Col>
            {isEditMode ? (
              <>
                <Form.Item label={t('user.detail.password')} name='password'>
                  <Input.Password />
                </Form.Item>
                <Form.Item name='version' noStyle>
                  <Input hidden />
                </Form.Item>
              </>
            ) : (
              <Form.Item
                label={t('user.detail.password')}
                name='password'
                rules={[
                  {
                    required: true,
                    message: `${t('user.detail.password_required')}`,
                  },
                ]}>
                <Input.Password />
              </Form.Item>
            )}
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
