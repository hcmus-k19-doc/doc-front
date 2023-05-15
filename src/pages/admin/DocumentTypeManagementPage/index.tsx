import React, { useState } from 'react';
import { Divider, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { RecoilRoot } from 'recoil';
import { usePaginationDocumentTypesRes } from 'shared/hooks/DocumentTypesQuery';

import DocumentTypeDetailModal from './components/DocumentTypeDetailModal';
import Footer from './components/Footer';
import { DocumentTypeTableRowDataType } from './core/models';

import './index.css';

const columns: ColumnsType<DocumentTypeTableRowDataType> = [
  {
    title: t('document_type_management.table.column.order'),
    dataIndex: 'order',
  },
  {
    title: t('document_type_management.table.column.type'),
    dataIndex: 'type',
  },
  {
    title: t('common.modal.description_title'),
    dataIndex: 'description',
    width: '35%',
  },
  {
    title: t('document_type_management.table.column.created_by'),
    dataIndex: 'createdBy',
  },
];

function DocumentTypeManagementPage() {
  const { isLoading, data } = usePaginationDocumentTypesRes();
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();

  const rowSelection = {
    selectedRowKeys: selectedDocumentTypes,
    onChange: (selectedRowKeys: React.Key[], selectedRows: DocumentTypeTableRowDataType[]) => {
      setSelectedDocumentTypes(selectedRows.map((doc) => doc.id));
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
      <div className='text-lg text-primary'>{t('main_page.menu.items.document_types')}</div>

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
            selectedDocumentTypes={selectedDocumentTypes}
            setSelectedDocumentTypes={setSelectedDocumentTypes}
          />
        )}
      />

      <DocumentTypeDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        isEditMode
      />
    </>
  );
}

export default function DocumentTypeManagementPageWrapper() {
  return (
    <RecoilRoot>
      <DocumentTypeManagementPage />
    </RecoilRoot>
  );
}
