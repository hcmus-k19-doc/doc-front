import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileZipOutlined, LoadingOutlined } from '@ant-design/icons';
import { Divider, Table, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from 'components/AuthComponent';
import TransferOutgoingDocModalDetail from 'components/TransferDocModal/components/TransferOutgoingDocModalDetail';
import { PRIMARY_COLOR } from 'config/constant';
import { ParentFolderEnum } from 'models/doc-file-models';
import {
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  OutgoingDocumentGetDto,
  ProcessingDocumentRoleEnum,
  UserDto,
} from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import attachmentService from 'services/AttachmentService';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useOutgoingDocRes } from 'shared/hooks/OutgoingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { getStepOutgoingDocument } from 'utils/TransferDocUtils';

import { getColorBaseOnStatus } from '../IncomingDocListPage/core/common';

import Footer from './components/Footer';
import OutgoingDocumentSearchForm from './components/OutgoingDocumentSearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const OutgoingDocListPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const showAlert = useSweetAlert();
  const [, setError] = useState<string>();
  const { isLoading, data, isFetching } = useOutgoingDocRes(false);
  const [transferDocDetailModalForm] = useForm();
  const [isDetailTransferModalOpen, setIsDetailTransferModalOpen] = useState(false);

  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<OutgoingDocumentGetDto[]>([]);
  const [transferredDoc, setTransferredDoc] = useState<OutgoingDocumentGetDto>();
  const [transferDocumentDetail, setTransferDocumentDetail] =
    useState<GetTransferDocumentDetailCustomResponse>();
  const [loading, setLoading] = useState<boolean>(false);
  const handleOnOpenDetailModal = async (event: any, tableRecord: TableRowDataType) => {
    event.preventDefault();
    setIsDetailTransferModalOpen(true);

    setTransferredDoc(tableRecord as unknown as OutgoingDocumentGetDto);
    const getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest = {
      documentId: tableRecord.id,
      userId: currentUser?.id as number,
      role: ProcessingDocumentRoleEnum.REPORTER,
      step: getStepOutgoingDocument(currentUser as UserDto, true),
    };

    if (tableRecord.isDocCollaborator) {
      getTransferDocumentDetailRequest.role = ProcessingDocumentRoleEnum.COLLABORATOR;
      getTransferDocumentDetailRequest.step = getStepOutgoingDocument(
        currentUser as UserDto,
        false
      );
    }

    setLoading(true);
    try {
      const response = await outgoingDocumentService.getTransferDocumentDetail(
        getTransferDocumentDetailRequest
      );
      setTransferDocumentDetail(response);
    } catch (error) {
      await showAlert({
        icon: 'error',
        html: t('incomingDocListPage.message.get_transfer_document_detail_error'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOnCloseDetailModal = () => {
    setIsDetailTransferModalOpen(false);
    transferDocDetailModalForm.resetFields();
  };

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('outgoingDocListPage.table.columns.ordinalNumber'),
      dataIndex: 'ordinalNumber',
      sorter: (a, b) => a.ordinalNumber - b.ordinalNumber,
    },
    {
      title: t('outgoingDocListPage.table.columns.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('outgoingDocListPage.table.columns.originId'),
      dataIndex: 'originId',
    },
    {
      title: t('outgoingDocListPage.table.columns.release_number'),
      dataIndex: 'releaseNumber',
      sorter: (a, b) => a.releaseNumber.localeCompare(b.releaseNumber),
    },
    {
      title: t('outgoingDocListPage.table.columns.type'),
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      filters: [...new Set(data?.payload.map((item) => item.type))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
    },
    {
      title: t('outgoingDocListPage.table.columns.status'),
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (_, record) => {
        return <Tag color={getColorBaseOnStatus(record.status, t)}>{record.status}</Tag>;
      },
    },
    {
      title: t('outgoingDocListPage.table.columns.issuePlace'),
      dataIndex: 'issuePlace',
      sorter: (a, b) => a.issuePlace.localeCompare(b.issuePlace),
      filters: [...new Set(data?.payload.map((item) => item.issuePlace))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.issuePlace.indexOf(value as string) === 0,
    },
    {
      title: t('outgoingDocListPage.table.columns.fullText'),
      dataIndex: 'fullText',
      align: 'center',
      render: () => {
        if (loading) {
          return <LoadingOutlined />;
        }

        return (
          <Tooltip
            title={t('outgoingDocListPage.table.tooltip.downloadAttachment')}
            placement='bottom'>
            <FileZipOutlined className='zip-icon' style={{ color: PRIMARY_COLOR }} />
          </Tooltip>
        );
      },
      onCell: (record) => {
        if (loading) {
          return {};
        }

        return {
          onClick: (event) => {
            event.stopPropagation();
            attachmentService.handleDownloadAttachment(
              record,
              ParentFolderEnum.OGD,
              setError,
              setLoading
            );
          },
        };
      },
    },
    {
      title: t('outgoingDocListPage.table.columns.summary'),
      dataIndex: 'summary',
      width: '20%',
      render: (text) => {
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
      },
    },
    {
      title: t('outgoingDocListPage.table.columns.transferDetailBtn'),
      dataIndex: 'isDocTransferred',
      render: (_, record) => {
        if (record.isDocTransferred || record.isDocCollaborator) {
          return (
            <a onClick={(event) => handleOnOpenDetailModal(event, record)}>
              {t('outgoingDocListPage.table.columns.transferDetail')}
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
      setSelectedDocs(selectedRows as unknown as OutgoingDocumentGetDto[]);
    },
  };

  return (
    <>
      <div className='text-lg text-primary'>{t('main_page.menu.items.outgoing_document_list')}</div>

      <OutgoingDocumentSearchForm />

      <Divider />

      <Table
        loading={isLoading || isFetching}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/list/docout/out-detail/${record.id}`);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          getCheckboxProps: (record) => ({
            disabled:
              record.isDocTransferred ||
              record.isDocCollaborator ||
              !record.isTransferable ||
              record.releaseNumber !== null,
          }),
        }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => (
          <Footer
            selectedDocs={selectedDocs}
            setSelectedDocs={setSelectedDocs}
            csvData={data?.payload}
          />
        )}
      />

      <TransferOutgoingDocModalDetail
        form={transferDocDetailModalForm}
        isModalOpen={isDetailTransferModalOpen}
        handleClose={handleOnCloseDetailModal}
        transferredDoc={transferredDoc as OutgoingDocumentGetDto}
        transferDocumentDetail={transferDocumentDetail as GetTransferDocumentDetailCustomResponse}
        type={'OutgoingDocument'}
        loading={loading}
      />
    </>
  );
};

const OutgoingDocListPageWrapper = () => (
  <RecoilRoot>
    <OutgoingDocListPage />
  </RecoilRoot>
);

export default OutgoingDocListPageWrapper;
