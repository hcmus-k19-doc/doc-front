import React from 'react';
import { Col, Divider, Form, FormInstance, Input, Modal, Row } from 'antd';
import { t } from 'i18next';
import { useSaveDepartmentMutation } from 'shared/hooks/DepartmentQuery';

import { DepartmentTableRowDataType } from '../core/models';

interface Props {
  form: FormInstance;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  isEditMode?: boolean;
}

export default function DepartmentDetailModal({
  form,
  isModalOpen,
  handleOk,
  handleCancel,
  isEditMode,
}: Props) {
  const departmentMutation = useSaveDepartmentMutation();

  return (
    <Modal
      title={t('department_management.department.detail.title')}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Divider />
      <Row className='mt-5'>
        <Form
          form={form}
          onFinish={(values: DepartmentTableRowDataType) => {
            departmentMutation.mutate(values);
          }}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout='horizontal'
          className='w-[400px]'>
          <Col>
            <Form.Item label={t('department_management.department.detail.id')} name='id'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('department_management.department.detail.name')}
              name='departmentName'
              rules={[
                {
                  required: true,
                  message: `${t('department_management.department.detail.name_required')}`,
                },
              ]}>
              <Input />
            </Form.Item>
          </Col>
          <Col>
            {isEditMode && (
              <Form.Item name='version' noStyle>
                <Input hidden />
              </Form.Item>
            )}
          </Col>
        </Form>
      </Row>
    </Modal>
  );
}
