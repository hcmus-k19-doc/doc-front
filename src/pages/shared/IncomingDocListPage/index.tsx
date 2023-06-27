import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileZipOutlined, LoadingOutlined } from '@ant-design/icons';
import { Divider, Table, Tag, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from 'components/AuthComponent';
import TransferDocModalDetail from 'components/TransferDocModal/components/TransferDocModalDetail';
import { PRIMARY_COLOR } from 'config/constant';
import { ParentFolderEnum } from 'models/doc-file-models';
import {
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  IncomingDocumentDto,
  ProcessingDocumentRoleEnum,
  UserDto,
} from 'models/doc-main-models';
import moment from 'moment';
import { RecoilRoot } from 'recoil';
import attachmentService from 'services/AttachmentService';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { YEAR_MONTH_DAY_FORMAT } from 'utils/DateTimeUtils';
import { getStep } from 'utils/TransferDocUtils';

import Footer from './components/Footer';
import IncomingDocumentSearchForm from './components/IncomingDocumentSearchForm';
import { getColorBaseOnStatus } from './core/common';
import { TableRowDataType } from './core/models';

import './index.css';

const IncomingDocListPage: React.FC = () => {
  const { currentUser } = useAuth();

  const showAlert = useSweetAlert();
  const [_, setError] = useState<string>();
  const { isLoading, data, isFetching } = useIncomingDocRes(false);
  const [transferDocDetailModalForm] = useForm();
  const [isDetailTransferModalOpen, setIsDetailTransferModalOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedDocs, setSelectedDocs] = useState<IncomingDocumentDto[]>([]);
  const [transferredDoc, setTransferredDoc] = useState<IncomingDocumentDto>();
  const [transferDocumentDetail, setTransferDocumentDetail] =
    useState<GetTransferDocumentDetailCustomResponse>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleOnOpenDetailModal = async (event: any, tableRecord: TableRowDataType) => {
    event.preventDefault();
    setIsDetailTransferModalOpen(true);

    setTransferredDoc(tableRecord as unknown as IncomingDocumentDto);
    const getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest = {
      documentId: tableRecord.id,
      userId: currentUser?.id as number,
      role: ProcessingDocumentRoleEnum.REPORTER,
      step: getStep(currentUser as UserDto, null, true),
    };

    if (tableRecord.isDocCollaborator) {
      getTransferDocumentDetailRequest.role = ProcessingDocumentRoleEnum.COLLABORATOR;
      getTransferDocumentDetailRequest.step = getStep(currentUser as UserDto, null, false);
    }

    setLoading(true);
    try {
      const response = await incomingDocumentService.getTransferDocumentDetail(
        getTransferDocumentDetailRequest
      );

      setTransferDocumentDetail(response);
    } catch (error) {
      showAlert({
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
      title: t('incomingDocListPage.table.columns.ordinalNumber'),
      dataIndex: 'ordinalNumber',
      sorter: (a, b) => a.ordinalNumber - b.ordinalNumber,
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
      title: t('incomingDocListPage.table.columns.name'),
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t('incomingDocListPage.table.columns.type'),
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
      filters: [...new Set(data?.payload.map((item) => item.type))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
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
      filters: [...new Set(data?.payload.map((item) => item.issuePlace))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.issuePlace.indexOf(value as string) === 0,
    },
    {
      title: t('incomingDocListPage.table.columns.fullText'),
      dataIndex: 'fullText',
      align: 'center',
      render: () => {
        if (loading) {
          return <LoadingOutlined />;
        }

        return (
          <Tooltip
            title={t('incomingDocListPage.table.tooltip.downloadAttachment')}
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
              ParentFolderEnum.ICD,
              setError,
              setLoading
            );
          },
        };
      },
    },
    {
      title: t('incomingDocListPage.table.columns.status'),
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
      filters: [...new Set(data?.payload.map((item) => item.status))].map((item) => ({
        text: item,
        value: item,
      })),
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
      render: (_, record) => {
        return <Tag color={getColorBaseOnStatus(record.status, t)}>{record.status}</Tag>;
      },
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
        if (record.isDocTransferred || record.isDocCollaborator) {
          return (
            <a onClick={(event) => handleOnOpenDetailModal(event, record)}>
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
        style={{ width: 'auto' }}
        loading={isLoading || isFetching}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/list/docin/in-detail/${record.id}`);
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
              record.status === 'Đã xử lý' ||
              record.status === 'Closed',
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

      <TransferDocModalDetail
        form={transferDocDetailModalForm}
        isModalOpen={isDetailTransferModalOpen}
        handleClose={handleOnCloseDetailModal}
        transferredDoc={transferredDoc as IncomingDocumentDto}
        transferDocumentDetail={transferDocumentDetail as GetTransferDocumentDetailCustomResponse}
        type={'IncomingDocument'}
        loading={loading}
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
