import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Divider, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { RecoilRoot } from 'recoil';
import { useUserRes } from 'shared/hooks/UserQuery';

import Footer from './components/Footer';
import UserDetailModal from './components/UserDetailModal';
import UserSearchForm from './components/UserSearchForm';
import { UserTableRowDataType } from './core/models';

import './index.css';

const columns: ColumnsType<UserTableRowDataType> = [
  {
    title: t('user_management.table.column.id'),
    dataIndex: 'id',
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
    dataIndex: 'role',
  },
  {
    title: t('user_management.table.column.department'),
    dataIndex: 'department',
  },
];

function UserManagementPage() {
  const { isLoading, data } = useUserRes();
  const [selectedUsers, setSelectedUsers] = useState<UserTableRowDataType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();

  const rowSelection = {
    selectedRowKeys: selectedUsers.map((doc) => doc.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: UserTableRowDataType[]) => {
      setSelectedUsers(selectedRows);
    },
  };

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
    <>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.users')}</div>

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
