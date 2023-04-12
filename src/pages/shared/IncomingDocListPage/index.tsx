import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileZipOutlined } from '@ant-design/icons';
import { Button, Divider, message, Table, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import TransferDocModal from 'components/TransferDocModal';
import { PRIMARY_COLOR } from 'config/constant';
import { TransferDocDto } from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import attachmentService from 'services/AttachmentService';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import Swal from 'sweetalert2';

import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const IncomingDocListPage: React.FC = () => {
  const { t } = useTranslation();
  const [, setError] = useState<string>();
  const { isLoading, data } = useIncomingDocRes();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocIds, setSelectedDocIds] = useState<number[]>([]);
  const transferQuerySetter = useTransferQuerySetter();

  const handleDownloadAttachment = async (record: TableRowDataType) => {
    try {
      const response = await attachmentService.downloadAttachments(
        record.attachments,
        record.id.toString()
      );

      if (response.status === 204) {
        Swal.fire({
          icon: 'error',
          html: t('incomingDocListPage.message.attachment.not_found') as string,
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } else if (response.status === 200) {
        attachmentService.saveZipFileToDisk(response);
        Swal.fire({
          icon: 'success',
          html: t('incomingDocListPage.message.attachment.download_success') as string,
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
        console.error(error.response?.data.message);
      } else {
        console.error(error);
      }
    }
  };

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('incomingDocListPage.table.columns.id'),
      dataIndex: 'id',
    },
    {
      title: t('incomingDocListPage.table.columns.type'),
      dataIndex: 'type',
    },
    {
      title: t('incomingDocListPage.table.columns.arriveId'),
      dataIndex: 'arriveId',
      render: (text: string) => <a className='link'>{text}</a>,
    },
    {
      title: t('incomingDocListPage.table.columns.originId'),
      dataIndex: 'originId',
      render: (text: string) => <a className='link'>{text}</a>,
    },
    {
      title: t('incomingDocListPage.table.columns.arriveDate'),
      dataIndex: 'arriveDate',
    },
    {
      title: t('incomingDocListPage.table.columns.issuePlace'),
      dataIndex: 'issuePlace',
    },
    {
      title: t('incomingDocListPage.table.columns.summary'),
      dataIndex: 'summary',
      width: '25%',
    },
    {
      title: t('incomingDocListPage.table.columns.fullText'),
      dataIndex: 'fullText',
      align: 'center',
      render: (text, record) => {
        return (
          <Tooltip
            title={t('incomingDocListPage.table.tooltip.downloadAttachment')}
            placement='bottom'>
            <FileZipOutlined
              className='zip-icon'
              onClick={() => handleDownloadAttachment(record)}
            />
          </Tooltip>
        );
      },
    },
    {
      title: t('incomingDocListPage.table.columns.status'),
      dataIndex: 'status',
    },
    {
      title: t('incomingDocListPage.table.columns.deadline'),
      dataIndex: 'deadline',
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedDocIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: TableRowDataType[]) => {
      setSelectedDocIds(selectedRows.map((row) => row.id));
    },
  };

  const handleOnOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleOnCancelModal = () => {
    setIsModalOpen(false);
    modalForm.resetFields();
    transferQuerySetter(initialTransferQueryState);
  };

  const handleOnOkModal = async () => {
    const transferDocDto: TransferDocDto = {
      documentIds: selectedDocIds,
      summary: modalForm.getFieldValue('summary'),
      assigneeId: modalForm.getFieldValue('assignee') as number,
      collaboratorIds: modalForm.getFieldValue('collaborators') as number[],
      processingTime: modalForm.getFieldValue('processingTime'),
      infiniteProcessingTime: modalForm.getFieldValue('isInfiniteProcessingTime'),
    };
    if (
      validateAssigneeAndCollaborators(transferDocDto.assigneeId, transferDocDto.collaboratorIds)
    ) {
      setIsModalOpen(false);
      modalForm.submit();
      console.log(modalForm.getFieldsValue());

      modalForm.resetFields();
      transferQuerySetter(transferDocDto);
      try {
        const response = await incomingDocumentService.transferDocumentsToDirector(transferDocDto);
        console.log('response', response);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message);
          console.error(error.response?.data.message);
        } else {
          console.error(error);
        }
      }
      setSelectedDocIds([]);
    }
  };

  const validateAssigneeAndCollaborators = (assigneeId?: number, collaboratorIds?: number[]) => {
    if (!assigneeId) {
      message.error(t('transfer_modal.form.assignee_required'));
      return false;
    }
    if (collaboratorIds?.length === 0 || !collaboratorIds) {
      message.error(t('transfer_modal.form.collaborators_required'));
      return false;
    }
    if (collaboratorIds?.includes(assigneeId as number)) {
      message.error(t('transfer_modal.form.collaborator_can_not_has_same_value_with_assignee'));
      return false;
    }
    return true;
  };

  const hasSelected = selectedDocIds.length > 0;

  return (
    <>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <SearchForm />

      <Divider />

      <Table
        loading={isLoading}
        rowSelection={{ type: 'checkbox', ...rowSelection }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={Footer}
      />

      <Divider />

      <div className='float-right px-8'>
        <span style={{ marginRight: 8 }}>
          {hasSelected ? `Selected ${selectedDocIds.length} items` : ''}
        </span>
        <Button htmlType='button' onClick={handleOnOpenModal} disabled={!hasSelected}>
          {t('incomingDocDetailPage.button.transfer')}
        </Button>
      </div>

      <TransferDocModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        selectedDocIds={selectedDocIds}
      />
    </>
  );
};

const IncomingDocListPageWrapper = () => (
  <RecoilRoot>
    <IncomingDocListPage />
  </RecoilRoot>
);

export default IncomingDocListPageWrapper;
