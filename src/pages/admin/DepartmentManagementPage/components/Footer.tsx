import React, { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { t } from 'i18next';
import { useDepartmentReq, usePaginationDepartments } from 'shared/hooks/DepartmentQuery';
import { useDocumentTypeDeleteMutation } from 'shared/hooks/DocumentTypesQuery';

import { FooterProps } from '../core/models';

import DepartmentDetailModal from './DepartmentDetailModal';

export default function Footer({ selectedDepartments, setSelectedDepartments }: FooterProps) {
  const [departmentReqQuery, setDepartmentReqQuery] = useDepartmentReq();
  const { data, refetch } = usePaginationDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const documentTypeDeleteMutation = useDocumentTypeDeleteMutation();

  function handleOnChange(page: number, pageSize: number) {
    setSelectedDepartments([]);
    setDepartmentReqQuery({ ...departmentReqQuery, page, pageSize });
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

  function handleOnClickDeleteUser() {
    documentTypeDeleteMutation.mutate(selectedDepartments);
  }

  return (
    <div className='flex justify-between'>
      <Space wrap>
        <Button
          type='primary'
          onClick={() => refetch()}
          icon={<FontAwesomeIcon icon={faRefresh} />}
        />
        <Button type='primary' onClick={handleOnOpenModal}>
          {t('department_management.button.add')}
        </Button>

        <Button
          type='primary'
          className='danger-button'
          danger
          onClick={handleOnClickDeleteUser}
          disabled={selectedDepartments.length === 0}>
          {t('department_management.button.delete')}
        </Button>
      </Space>

      <Pagination
        current={departmentReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('common.pagination.show_total', { total })}
      />

      <DepartmentDetailModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
      />
    </div>
  );
}
