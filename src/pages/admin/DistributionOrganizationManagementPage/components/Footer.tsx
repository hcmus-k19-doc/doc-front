import React, { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import {
  useDistributionOrganizationReq,
  usePaginationDistributionOrganizations,
} from '../../../../shared/hooks/DistributionOrganizationsQuery';

import DistributionOrganizationDetailModal from './DistributionOrganizationDetailModal';

export default function Footer() {
  const [distributionOrganizationReqQuery, setDistributionOrganizationReqQuery] =
    useDistributionOrganizationReq();
  const { data, refetch, isFetching } = usePaginationDistributionOrganizations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const [modal, contextHolder] = useModal();
  const showAlert = useSweetAlert();
  function handleOnChange(page: number, pageSize: number) {
    setDistributionOrganizationReqQuery({ ...distributionOrganizationReqQuery, page, pageSize });
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
        html: t(
          'distribution_organizations_management.distribution_organizations.create_distribution_organizations_success'
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
          {t('distribution_organizations_management.button.add')}
        </Button>
      </Space>

      <Pagination
        current={distributionOrganizationReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('common.pagination.show_total', { total })}
      />

      <DistributionOrganizationDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
      />

      {contextHolder}
    </div>
  );
}
