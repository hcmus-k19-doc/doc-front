import React, { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';
import { useOnClickDelete } from 'pages/admin/shared/handler';
import { useUserDeleteMutation, useUserReq, useUserRes } from 'shared/hooks/UserQuery';

import { FooterProps } from '../core/models';

import UserDetailModal from './UserDetailModal';

export default function Footer({ selectedUsers, setSelectedUsers }: FooterProps) {
  const [userReqQuery, setUserReqQuery] = useUserReq();
  const { data, refetch } = useUserRes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const userDisableMutation = useUserDeleteMutation();
  const [modal, contextHolder] = useModal();

  function handleOnChange(page: number, pageSize: number) {
    setSelectedUsers([]);
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

  return (
    <div className='flex justify-between'>
      <Space wrap>
        <Button
          type='primary'
          onClick={() => refetch()}
          icon={<FontAwesomeIcon icon={faRefresh} />}>
          {t('common.button.refresh')}
        </Button>

        <Button type='primary' onClick={handleOnOpenModal}>
          {t('user_management.button.add')}
        </Button>

        <Button
          type='primary'
          className='danger-button'
          danger
          onClick={() => useOnClickDelete(() => userDisableMutation.mutate(selectedUsers), modal)}>
          {t('user_management.button.delete')}
        </Button>
      </Space>

      <Pagination
        current={userReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('common.pagination.show_total', { total })}
      />

      <UserDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
      />

      {contextHolder}
    </div>
  );
}
