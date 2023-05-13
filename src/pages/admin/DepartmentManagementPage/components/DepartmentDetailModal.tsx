import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Col, Divider, Form, FormInstance, Input, Modal, Row, Select } from 'antd';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';
import adminService from 'services/AdminService';
import { useSaveDepartmentMutation } from 'shared/hooks/DepartmentQuery';
import { useTruongPhongs } from 'shared/hooks/UserQuery';

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
  const saveDepartmentMutation = useSaveDepartmentMutation();
  const { data: truongPhongs } = useTruongPhongs();
  const [modal, contextHolder] = useModal();

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
          onFinish={async (values: DepartmentTableRowDataType) => {
            let isAlreadyAssigned = false;
            if (values.id) {
              isAlreadyAssigned = await adminService.isUserAlreadyTruongPhongOfAnotherDepartment(
                values.truongPhongId,
                values.id
              );
            }

            if (isAlreadyAssigned) {
              modal.confirm({
                title: t('department_management.department.detail.modal.title'),
                icon: <ExclamationCircleOutlined />,
                content: t('department_management.department.detail.modal.content'),
                okText: t('common.modal.ok_text'),
                cancelText: t('common.modal.cancel_text'),
                onOk: () => saveDepartmentMutation.mutate(values),
              });
            } else {
              saveDepartmentMutation.mutate(values);
            }
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
          <Col>
            <Form.Item
              label={t('department_management.department.detail.truong_phong')}
              rules={[
                {
                  required: true,
                  message: `${t('department_management.department.detail.truong_phong_required')}`,
                },
              ]}
              name='truongPhongId'>
              <Select>
                {truongPhongs?.map((truongPhong) => (
                  <Select.Option key={truongPhong.id} value={truongPhong.id}>
                    {truongPhong.fullName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Form>
      </Row>
      {contextHolder}
    </Modal>
  );
}
