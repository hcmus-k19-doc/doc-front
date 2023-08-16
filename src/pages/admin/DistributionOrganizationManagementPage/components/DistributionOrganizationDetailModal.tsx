import React from 'react';
import { Col, Divider, Form, FormInstance, Input, Modal, Row } from 'antd';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';

import { useSaveDistributionOrganizationMutation } from '../../../../shared/hooks/DistributionOrganizationsQuery';
import { DistributionOrganizationTableRowDataType } from '../core/models';

interface Props {
  form: FormInstance;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  isEditMode?: boolean;
}

export default function DistributionOrganizationDetailModal({
  form,
  isModalOpen,
  handleOk,
  handleCancel,
  isEditMode,
}: Props) {
  const saveDistributionOrganizationMutation = useSaveDistributionOrganizationMutation();
  const [modal, contextHolder] = useModal();

  return (
    <Modal
      title={t('distribution_organizations_management.distribution_organizations.detail.title')}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Divider />
      <Row className='mt-5'>
        <Form
          form={form}
          onFinish={async (values: DistributionOrganizationTableRowDataType) => {
            saveDistributionOrganizationMutation.mutate(values);
          }}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout='horizontal'
          className='w-[400px]'>
          <Col>
            <Form.Item
              label={t(
                'distribution_organizations_management.distribution_organizations.detail.id'
              )}
              name='id'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t(
                'distribution_organizations_management.distribution_organizations.detail.name'
              )}
              name='name'
              rules={[
                {
                  required: true,
                  message: `${t(
                    'distribution_organizations_management.distribution_organizations.detail.name_required'
                  )}`,
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
              label={t(
                'distribution_organizations_management.distribution_organizations.detail.symbol'
              )}
              rules={[
                {
                  required: true,
                  message: `${t(
                    'distribution_organizations_management.distribution_organizations.detail.symbol_required'
                  )}`,
                },
              ]}
              name='symbol'>
              <Input />
            </Form.Item>
          </Col>
        </Form>
      </Row>
      {contextHolder}
    </Modal>
  );
}
