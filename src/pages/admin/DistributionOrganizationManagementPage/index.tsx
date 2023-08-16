import React, { useState } from 'react';
import { Divider, Table } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { t } from 'i18next';
import { RecoilRoot } from 'recoil';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import { usePaginationDistributionOrganizations } from '../../../shared/hooks/DistributionOrganizationsQuery';

import DistributionOrganizationDetailModal from './components/DistributionOrganizationDetailModal';
import Footer from './components/Footer';
import { DistributionOrganizationTableRowDataType } from './core/models';

import './index.css';

const columns: ColumnsType<DistributionOrganizationTableRowDataType> = [
  {
    title: t('distribution_organizations_management.table.column.order'),
    dataIndex: 'order',
    align: 'center',
  },
  {
    title: t('distribution_organizations_management.table.column.name'),
    dataIndex: 'name',
  },
  {
    title: t('distribution_organizations_management.table.column.symbol'),
    dataIndex: 'symbol',
  },
  {
    title: t('distribution_organizations_management.table.column.created_by'),
    dataIndex: 'createdBy',
  },
];

function DistributionOrganizationManagementPage() {
  const { isLoading, data } = usePaginationDistributionOrganizations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const showAlert = useSweetAlert();

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
        html: t(
          'distribution_organizations_management.distribution_organizations.update_distribution_organizations_success'
        ),
        showConfirmButton: true,
      });
    } catch (e) {
      console.error(e);
      showAlert({
        icon: 'error',
        html: t('distribution_organizations_management.distribution_organizations.error'),
        showConfirmButton: true,
      });
    }
  }

  return (
    <>
      <div className='text-lg text-primary'>
        {t('main_page.menu.items.distribution_organizations')}
      </div>

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
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => <Footer />}
      />

      <DistributionOrganizationDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        isEditMode
      />
    </>
  );
}

export default function DistributionOrganizationManagementPageWrapper() {
  return (
    <RecoilRoot>
      <DistributionOrganizationManagementPage />
    </RecoilRoot>
  );
}
