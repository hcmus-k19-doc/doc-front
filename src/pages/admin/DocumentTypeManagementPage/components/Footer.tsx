import React, { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { t } from 'i18next';
import {
  useDocumentTypeDeleteMutation,
  useDocumentTypesReq,
  usePaginationDocumentTypesRes,
} from 'shared/hooks/DocumentTypesQuery';
import { useUserDeleteMutation, useUserReq, useUserRes } from 'shared/hooks/UserQuery';

import { FooterProps } from '../core/models';

import DocumentTypeDetailModal from './DocumentTypeDetailModal';

export default function Footer({ selectedDocumentTypes, setSelectedDocumentTypes }: FooterProps) {
  const [userReqQuery, setUserReqQuery] = useDocumentTypesReq();
  const { data, refetch } = usePaginationDocumentTypesRes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const documentTypeDeleteMutation = useDocumentTypeDeleteMutation();

  function handleOnChange(page: number, pageSize: number) {
    setSelectedDocumentTypes([]);
    setUserReqQuery({ ...userReqQuery, page, pageSize });
  }

  function handleOnOpenModal() {
    modalForm.resetFields();
    setIsModalOpen(true);
  }

  function handleOnCancelModal() {
    setIsModalOpen(false);
    modalForm.resetFields();
  }

  async function handleOnOkModal() {
    try {
      await modalForm.validateFields();
      setIsModalOpen(false);
      modalForm.submit();
    } catch (e) {
      console.error(e);
    }
  }

  function handleOnClickDeleteUser() {
    documentTypeDeleteMutation.mutate(selectedDocumentTypes);
  }

  return (
    <div className='flex justify-between'>
      <Space wrap>
        <Button
          type='primary'
          onClick={() => refetch()}
          icon={<FontAwesomeIcon icon={faRefresh} />}
        />
        <Button type='primary' onClick={handleOnOpenModal}>
          {t('document_type_management.button.add')}
        </Button>

        <Button
          type='primary'
          className='danger-button'
          danger
          onClick={handleOnClickDeleteUser}
          disabled={selectedDocumentTypes.length === 0}>
          {t('document_type_management.button.delete')}
        </Button>
      </Space>

      <Pagination
        current={userReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('common.pagination.show_total', { total })}
      />

      <DocumentTypeDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
      />
    </div>
  );
}
