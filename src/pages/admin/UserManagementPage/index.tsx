import React, { useState } from 'react';
import { Divider, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { RecoilRoot } from 'recoil';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { useUserRes } from 'shared/hooks/UserQuery';

import Footer from './components/Footer';
import UserDetailModal from './components/UserDetailModal';
import UserSearchForm from './components/UserSearchForm';
import { UserTableRowDataType } from './core/models';

import './index.css';

const columns: ColumnsType<UserTableRowDataType> = [
  {
    title: t('user_management.table.column.order'),
    dataIndex: 'order',
  },
  {
    title: t('user_management.table.column.username'),
    dataIndex: 'username',
  },
  {
    title: t('user_management.table.column.email'),
    dataIndex: 'email',
  },
  {
    title: t('user_management.table.column.full_name'),
    dataIndex: 'fullName',
  },
  {
    title: t('user_management.table.column.role'),
    dataIndex: 'translatedRole',
  },
  {
    title: t('user_management.table.column.role_title'),
    dataIndex: 'roleTitle',
  },
  {
    title: t('user_management.table.column.department'),
    dataIndex: 'department',
  },
];

function UserManagementPage() {
  const { isLoading, data } = useUserRes();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const [loading, setLoading] = useState(false);
  const showAlert = useSweetAlert();

  const rowSelection = {
    selectedRowKeys: selectedUsers,
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserTableRowDataType[]) => {
      setSelectedUsers(selectedRows.map((doc) => doc.id));
    },
  };

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
        html: t('user_management.user_function.update_user_success'),
        showConfirmButton: true,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className='text-lg text-primary'>{t('main_page.menu.items.users')}</div>

      <UserSearchForm />

      <Divider />

      <Table
        loading={isLoading}
        onRow={(record) => {
          return {
            onClick: () => {
              modalForm.resetFields();
              setIsModalOpen(true);
              modalForm.setFieldsValue(record);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => <Footer selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />}
      />

      <UserDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        isEditMode
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}

export default function UserManagementPageWrapper() {
  return (
    <RecoilRoot>
      <UserManagementPage />
    </RecoilRoot>
  );
}
