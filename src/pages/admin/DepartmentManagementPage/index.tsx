import React, { useState } from 'react';
import { Divider, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { RecoilRoot } from 'recoil';
import { usePaginationDepartments } from 'shared/hooks/DepartmentQuery';

import DepartmentDetailModal from './components/DepartmentDetailModal';
import Footer from './components/Footer';
import { DepartmentTableRowDataType } from './core/models';

import './index.css';

const columns: ColumnsType<DepartmentTableRowDataType> = [
  {
    title: t('department_management.table.column.order'),
    dataIndex: 'order',
    align: 'center',
  },
  {
    title: t('department_management.table.column.name'),
    dataIndex: 'departmentName',
    align: 'center',
  },
  {
    title: t('department_management.table.column.created_by'),
    dataIndex: 'createdBy',
    align: 'center',
  },
];

function DepartmentManagementPage() {
  const { isLoading, data } = usePaginationDepartments();
  const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();

  const rowSelection = {
    selectedRowKeys: selectedDepartments,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DepartmentTableRowDataType[]) => {
      setSelectedDepartments(selectedRows.map((doc) => doc.id));
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
      <div className='text-lg text-primary'>{t('main_page.menu.items.departments')}</div>

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
        footer={() => (
          <Footer
            selectedDepartments={selectedDepartments}
            setSelectedDepartments={setSelectedDepartments}
          />
        )}
      />

      <DepartmentDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        isEditMode
      />
    </>
  );
}

export default function DepartmentManagementPageWrapper() {
  return (
    <RecoilRoot>
      <DepartmentManagementPage />
    </RecoilRoot>
  );
}
