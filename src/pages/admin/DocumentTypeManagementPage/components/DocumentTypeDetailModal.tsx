import React from 'react';
import { Col, Divider, Form, FormInstance, Input, Modal, Row } from 'antd';
import { t } from 'i18next';
import { useDocumentTypeMutation } from 'shared/hooks/DocumentTypesQuery';

import { DocumentTypeTableRowDataType } from '../core/models';

interface Props {
  form: FormInstance;
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  isEditMode?: boolean;
}

export default function DocumentTypeDetailModal({
  form,
  isModalOpen,
  handleOk,
  handleCancel,
  isEditMode,
}: Props) {
  const documentTypeMutation = useDocumentTypeMutation();

  return (
    <Modal
      title={t('document_type_management.document_type.detail.title')}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}>
      <Divider />
      <Row className='mt-5'>
        <Form
          form={form}
          onFinish={(values: DocumentTypeTableRowDataType) => {
            documentTypeMutation.mutate(values);
          }}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          layout='horizontal'
          className='w-[400px]'>
          <Col>
            <Form.Item label={t('document_type_management.document_type.detail.id')} name='id'>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label={t('document_type_management.document_type.detail.type')}
              name='type'
              rules={[
                {
                  required: true,
                  message: `${t('document_type_management.document_type.detail.type_required')}`,
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
            <Form.Item name='description' label={t('common.modal.description_title')}>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Form>
      </Row>
    </Modal>
  );
}
