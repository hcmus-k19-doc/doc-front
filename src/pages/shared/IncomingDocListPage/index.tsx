import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileZipOutlined } from '@ant-design/icons';
import { Button, Divider, Table, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import TransferDocModal from 'components/TransferDocModal';
import { PRIMARY_COLOR } from 'config/constant';
import { IncomingDocumentDto, TransferDocDto } from 'models/doc-main-models';
import { RecoilRoot, useRecoilValue } from 'recoil';
import attachmentService from 'services/AttachmentService';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';

import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import { getSelectedDocsMessage } from './core/common';
import { TableRowDataType } from './core/models';
import { transferDocModalState } from './core/states';

import './index.css';

const IncomingDocListPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const showAlert = useSweetAlert();
  const [, setError] = useState<string>();
  const { isLoading, data } = useIncomingDocRes();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<IncomingDocumentDto[]>([]);
  const navigate = useNavigate();
  const transferQuerySetter = useTransferQuerySetter();
  const transferDocModalItem = useRecoilValue(transferDocModalState);

  const handleDownloadAttachment = async (record: TableRowDataType) => {
    try {
      const response = await attachmentService.downloadAttachments(
        record.attachments,
        record.id.toString()
      );

      if (response.status === 204) {
        showAlert({
          icon: 'error',
          html: t('incomingDocListPage.message.attachment.not_found') as string,
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } else if (response.status === 200) {
        attachmentService.saveZipFileToDisk(response);
        showAlert({
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
    },
    {
      title: t('incomingDocListPage.table.columns.originId'),
      dataIndex: 'originId',
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
      render: () => {
        return (
          <Tooltip
            title={t('incomingDocListPage.table.tooltip.downloadAttachment')}
            placement='bottom'>
            <FileZipOutlined className='zip-icon' />
          </Tooltip>
        );
      },
      onCell: (record) => {
        return {
          onClick: (event) => {
            event.stopPropagation();
            handleDownloadAttachment(record);
          },
        };
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
      processMethod: modalForm.getFieldValue('processMethod'),
      transferDocumentType: transferDocModalItem,
    };
    if (validateTransferDocs(selectedDocs, transferDocModalItem, transferDocDto, t)) {
      setIsModalOpen(false);
      modalForm.submit();
      console.log(modalForm.getFieldsValue());
      modalForm.resetFields();
      transferQuerySetter(transferDocDto);
      console.log(transferDocDto, transferDocModalItem);
      try {
        const response = await incomingDocumentService.transferDocuments(transferDocDto);
        console.log(response);
        if (response.status === 200) {
          // TODO: refetch data
          showAlert({
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
  const hasSelected = selectedDocs.length > 0;

  return (
    <>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <SearchForm />

      <Divider />

      <Table
        loading={isLoading}
        onRow={(record) => {
          return {
            onClick: () => {
              navigate(`/docin/detail/${record.id}`);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
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
                ...getSelectedDocsMessage(selectedDocs, t),
              })
            : ''}
        </span>
        {/*<Button htmlType='button' onClick={handleOnOpenModal} disabled={!hasSelected}>*/}
        {/*  {t('incomingDocDetailPage.button.transfer')}*/}
        {/*</Button>*/}
        <Button htmlType='button' onClick={handleOnOpenModal}>
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
