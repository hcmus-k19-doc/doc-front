import React, { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';
import {
  useDocumentTypesReq,
  usePaginationDocumentTypesRes,
} from 'shared/hooks/DocumentTypesQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import DocumentTypeDetailModal from './DocumentTypeDetailModal';

export default function Footer() {
  const [userReqQuery, setUserReqQuery] = useDocumentTypesReq();
  const { data, refetch, isFetching } = usePaginationDocumentTypesRes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const [modal, contextHolder] = useModal();
  const showAlert = useSweetAlert();
  function handleOnChange(page: number, pageSize: number) {
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
      showAlert({
        icon: 'success',
        html: t('document_type_management.document_type.create_document_type_success'),
        showConfirmButton: true,
      });
    } catch (e) {
      console.error(e);
      showAlert({
        icon: 'error',
        html: t('document_type_management.document_type.error'),
        showConfirmButton: true,
      });
    }
  }

  return (
    <div className='flex justify-between'>
      <Space wrap>
        <Button
          type='primary'
          loading={isFetching}
          onClick={() => refetch()}
          icon={<FontAwesomeIcon icon={faRefresh} style={{ marginRight: 5 }} />}>
          {t('common.button.refresh')}
        </Button>

        <Button type='primary' onClick={handleOnOpenModal} loading={isFetching}>
          {t('document_type_management.button.add')}
        </Button>

        {/* <Button
          type='primary'
          className='danger-button'
          danger
          onClick={handleOnClickDeleteUser}
          disabled={selectedDocumentTypes.length === 0}>
          {t('document_type_management.button.delete')}
        </Button> */}
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

      {contextHolder}
    </div>
  );
}
