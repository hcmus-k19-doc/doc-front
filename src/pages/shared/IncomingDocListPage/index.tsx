import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileZipOutlined } from '@ant-design/icons';
import { Button, Divider, message, Table, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import TransferDocModal from 'components/TransferDocModal';
import { PRIMARY_COLOR } from 'config/constant';
import { IncomingDocumentDto, TransferDocDto } from 'models/doc-main-models';
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
  const { currentUser } = useAuth();
  const [, setError] = useState<string>();
  const { isLoading, data } = useIncomingDocRes();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<IncomingDocumentDto[]>([]);
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
    selectedRowKeys: selectedDocs.map((doc) => doc.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: TableRowDataType[]) => {
      setSelectedDocs(selectedRows as unknown as IncomingDocumentDto[]);
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
      documentIds: selectedDocs.map((doc) => doc.id),
      summary: modalForm.getFieldValue('summary'),
      reporterId: currentUser?.id as number,
      assigneeId: modalForm.getFieldValue('assignee') as number,
      collaboratorIds: modalForm.getFieldValue('collaborators') as number[],
      processingTime: modalForm.getFieldValue('processingTime'),
      isInfiniteProcessingTime: modalForm.getFieldValue('isInfiniteProcessingTime'),
    };
    if (
      validateAssigneeAndCollaborators(transferDocDto.assigneeId, transferDocDto.collaboratorIds) &&
      isUnprocessedDocs(selectedDocs)
    ) {
      setIsModalOpen(false);
      modalForm.submit();
      modalForm.resetFields();
      transferQuerySetter(transferDocDto);
      try {
        const response = await incomingDocumentService.transferDocumentsToDirector(transferDocDto);
        if (response.status === 200) {
          // TODO: refetch data
          Swal.fire({
            icon: 'success',
            html: t('incomingDocListPage.message.transfer_success') as string,
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
      setSelectedDocs([]);
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

  const isUnprocessedDocs = (selectedDocs: IncomingDocumentDto[]) => {
    const result = selectedDocs.every((doc) => doc.status === t('PROCESSING_STATUS.UNPROCESSED'));
    if (!result) {
      message.error(t('transfer_modal.form.only_unprocessed_docs_can_be_transferred_to_director'));
      return false;
    }
    return true;
  };

  const hasSelected = selectedDocs.length > 0;

  const getSelectedDocsMessage = () => {
    const unprocessedDocs = selectedDocs.filter(
      (doc) => doc.status === t('PROCESSING_STATUS.UNPROCESSED')
    ).length;
    const processingDocs = selectedDocs.filter(
      (doc) => doc.status === t('PROCESSING_STATUS.IN_PROGRESS')
    ).length;
    const closedDocs = selectedDocs.filter(
      (doc) => doc.status === t('PROCESSING_STATUS.CLOSED')
    ).length;

    return { unprocessedDocs, processingDocs, closedDocs };
  };

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
          {hasSelected
            ? t('incomingDocListPage.message.selected_docs.summary', {
                count: hasSelected ? selectedDocs.length : 0,
                ...getSelectedDocsMessage(),
              })
            : ''}
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
        selectedDocs={selectedDocs}
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
