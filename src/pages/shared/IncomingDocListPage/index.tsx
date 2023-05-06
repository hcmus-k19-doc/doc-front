import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileZipOutlined } from '@ant-design/icons';
import { Divider, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { PRIMARY_COLOR } from 'config/constant';
import { IncomingDocumentDto } from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import attachmentService from 'services/AttachmentService';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import Footer from './components/Footer';
import IncomingDocumentSearchForm from './components/IncomingDocumentSearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const IncomingDocListPage: React.FC = () => {
  const { t } = useTranslation();

  const showAlert = useSweetAlert();
  const [, setError] = useState<string>();
  const { isLoading, data } = useIncomingDocRes();

  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<IncomingDocumentDto[]>([]);

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

  return (
    <>
      <div className='text-lg text-primary'>{t('MAIN_PAGE.MENU.ITEMS.INCOMING_DOCUMENT_LIST')}</div>

      <IncomingDocumentSearchForm />

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
        footer={() => <Footer selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} />}
      />

      <Divider />

      {/* <div className='float-right px-8'> */}

      {/*<Button htmlType='button' onClick={handleOnOpenModal} disabled={!hasSelected}>*/}
      {/*  {t('incomingDocDetailPage.button.transfer')}*/}
      {/*</Button>*/}
      {/* <Button htmlType='button' onClick={handleOnOpenModal}>
          {t('incomingDocDetailPage.button.transfer')}
        </Button> */}
      {/* </div> */}

      {/* <TransferDocModal
        form={modalForm}
        isModalOpen={isModalOpen}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        selectedDocs={selectedDocs}
      /> */}
    </>
  );
};

const IncomingDocListPageWrapper = () => (
  <RecoilRoot>
    <IncomingDocListPage />
  </RecoilRoot>
);

export default IncomingDocListPageWrapper;
