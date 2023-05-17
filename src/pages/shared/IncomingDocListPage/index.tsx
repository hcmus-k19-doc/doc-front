import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileZipOutlined } from '@ant-design/icons';
import { Divider, Table, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import TransferDocModalDetail from 'components/TransferDocModal/components/TransferDocModalDetail';
import { PRIMARY_COLOR } from 'config/constant';
import { IncomingDocumentDto } from 'models/doc-main-models';
import moment from 'moment';
import { RecoilRoot } from 'recoil';
import attachmentService from 'services/AttachmentService';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import { YEAR_MONTH_DAY_FORMAT } from '../../../utils/DateTimeUtils';

import Footer from './components/Footer';
import IncomingDocumentSearchForm from './components/IncomingDocumentSearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const IncomingDocListPage: React.FC = () => {
  const { t } = useTranslation();

  const showAlert = useSweetAlert();
  const [, setError] = useState<string>();
  const { isLoading, data } = useIncomingDocRes();
  const [transferDocModalForm] = useForm();
  const [isDetailTransferModalOpen, setIsDetailTransferModalOpen] = useState(false);

  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<IncomingDocumentDto[]>([]);
  const [transferredDoc, setTransferredDoc] = useState<IncomingDocumentDto>();

  const handleOnOpenModal = (event: any, tableRecord: TableRowDataType) => {
    event.preventDefault();
    setIsDetailTransferModalOpen(true);
    console.log('tableRecord', tableRecord);
    setTransferredDoc(tableRecord as unknown as IncomingDocumentDto);
  };

  const handleOnCloseModal = () => {
    setIsDetailTransferModalOpen(false);
    transferDocModalForm.resetFields();
  };

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
      title: t('incomingDocListPage.table.columns.type'),
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: t('incomingDocListPage.table.columns.arriveId'),
      dataIndex: 'arriveId',
      sorter: (a, b) => a.arriveId.localeCompare(b.arriveId),
    },
    {
      title: t('incomingDocListPage.table.columns.originId'),
      dataIndex: 'originId',
      sorter: (a, b) => a.originId.localeCompare(b.originId),
    },
    {
      title: t('incomingDocListPage.table.columns.arriveDate'),
      dataIndex: 'arriveDate',
      sorter: (a, b) =>
        moment(a.arriveDate, YEAR_MONTH_DAY_FORMAT).diff(
          moment(b.arriveDate, YEAR_MONTH_DAY_FORMAT)
        ),
    },
    {
      title: t('incomingDocListPage.table.columns.issuePlace'),
      dataIndex: 'issuePlace',
      sorter: (a, b) => a.issuePlace.localeCompare(b.issuePlace),
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
            <FileZipOutlined className='zip-icon' style={{ color: PRIMARY_COLOR }} />
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
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: t('incomingDocListPage.table.columns.deadline'),
      dataIndex: 'deadline',
      sorter: (a, b) =>
        moment(a.deadline, YEAR_MONTH_DAY_FORMAT).diff(moment(b.deadline, YEAR_MONTH_DAY_FORMAT)),
    },
    {
      title: t('incomingDocListPage.table.columns.transferDetailBtn'),
      dataIndex: 'isDocTransferred',
      render: (_, record) => {
        if (record.isDocTransferred) {
          return (
            <a onClick={(event) => handleOnOpenModal(event, record)}>
              {t('incomingDocListPage.table.columns.transferDetail')}
            </a>
          );
        }
        return null;
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys: selectedDocs.map((doc) => doc.id),
    onChange: (selectedRowKeys: React.Key[], selectedRows: TableRowDataType[]) => {
      setSelectedDocs(selectedRows as unknown as IncomingDocumentDto[]);
    },
  };

  return (
    <>
      <div className='text-lg text-primary'>{t('main_page.menu.items.incoming_document_list')}</div>

      <IncomingDocumentSearchForm />

      <Divider />

      <Table
        loading={isLoading}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/docin/in-detail/${record.id}`);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          getCheckboxProps: (record) => ({
            disabled: record.isDocTransferred,
          }),
        }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => <Footer selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} />}
      />

      <TransferDocModalDetail
        form={transferDocModalForm}
        isModalOpen={isDetailTransferModalOpen}
        handleClose={handleOnCloseModal}
        transferredDoc={transferredDoc as IncomingDocumentDto}
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
