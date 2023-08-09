import React, { useState } from 'react';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Space } from 'antd';
import { useForm } from 'antd/es/form/Form';
import useModal from 'antd/es/modal/useModal';
import { t } from 'i18next';
import { useOnClickDelete } from 'pages/admin/shared/handler';
import {
  useDeleteDepartmentsMutation,
  useDepartmentReq,
  usePaginationDepartments,
} from 'shared/hooks/DepartmentQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import { FooterProps } from '../core/models';

import DepartmentDetailModal from './DepartmentDetailModal';

export default function Footer({ selectedDepartments, setSelectedDepartments }: FooterProps) {
  const [departmentReqQuery, setDepartmentReqQuery] = useDepartmentReq();
  const { data, refetch, isFetching } = usePaginationDepartments();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const departmentsDeleteMutation = useDeleteDepartmentsMutation();
  const [modal, contextHolder] = useModal();
  const showAlert = useSweetAlert();
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
      showAlert({
        icon: 'success',
        html: t('department_management.department.create_department_success'),
        showConfirmButton: true,
      });
    } catch (e) {
      console.error(e);
      showAlert({
        icon: 'error',
        html: t('department_management.department.error'),
        showConfirmButton: true,
      });
    }
  }

  function handleOnDelete() {
    useOnClickDelete(() => {
      try {
        departmentsDeleteMutation.mutate(selectedDepartments);
        showAlert({
          icon: 'success',
          html: t('department_management.department.delete_department_success'),
          showConfirmButton: true,
        });
      } catch (error) {
        showAlert({
          icon: 'error',
          html: t('department_management.department.error'),
          showConfirmButton: true,
        });
      }
    }, modal);
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
          {t('department_management.button.add')}
        </Button>

        <Button
          type='primary'
          className='danger-button'
          danger
          loading={isFetching}
          onClick={handleOnDelete}
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

      {contextHolder}
    </div>
  );
}
