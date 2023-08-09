import { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';
import { useOnClickDelete } from 'pages/admin/shared/handler';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { useUserDeleteMutation, useUserReq, useUserRes } from 'shared/hooks/UserQuery';

import { FooterProps } from '../core/models';

import UserDetailModal from './UserDetailModal';

export default function Footer({ selectedUsers, setSelectedUsers }: FooterProps) {
  const [userReqQuery, setUserReqQuery] = useUserReq();
  const { data, refetch, isFetching } = useUserRes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const userDisableMutation = useUserDeleteMutation();
  const [modal, contextHolder] = useModal();
  const [loading, setLoading] = useState(false);
  const showAlert = useSweetAlert();

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
    setLoading(true);
    try {
      await modalForm.validateFields();
      setIsModalOpen(false);
      modalForm.submit();
      showAlert({
        icon: 'success',
        html: t('user_management.user_function.create_user_success'),
        showConfirmButton: true,
      });
    } catch (e) {
      console.error(e);
      showAlert({
        icon: 'error',
        html: t('user_management.user_function.error'),
        showConfirmButton: true,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleOnDeleteUsers = () => {
    useOnClickDelete(() => {
      try {
        userDisableMutation.mutate(selectedUsers);
        showAlert({
          icon: 'success',
          html: t('user_management.user_function.delete_user_success'),
          showConfirmButton: true,
        });
      } catch (error) {
        console.log(error);
      }
    }, modal);
  };

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
          {t('user_management.button.add')}
        </Button>

        {/* <Button
          type='primary'
          className='danger-button'
          danger
          disabled={selectedUsers.length === 0}
          onClick={handleOnDeleteUsers}>
          {t('user_management.button.delete')}
        </Button> */}
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
        loading={loading}
        setLoading={setLoading}
      />

      {contextHolder}
    </div>
  );
}
