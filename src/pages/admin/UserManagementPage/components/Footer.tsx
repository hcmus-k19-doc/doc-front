import React, { useState } from 'react';
import { Button, Pagination } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { t } from 'i18next';
import { useUserReq, useUserRes } from 'shared/hooks/UserQuery';

import { FooterProps } from '../core/models';

import UserDetailModal from './UserDetailModal';

const Footer: React.FC<FooterProps> = ({ selectedUsers, setSelectedUsers }) => {
  const [userReqQuery, setUserReqQuery] = useUserReq();
  const { data } = useUserRes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();

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
      <Button type='primary' onClick={handleOnOpenModal}>
        {t('user_management.button.add_user')}
      </Button>

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
    </div>
  );
};

export default Footer;
