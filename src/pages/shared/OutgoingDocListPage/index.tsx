import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FileZipOutlined } from '@ant-design/icons';
import { Divider, Table, Tooltip } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { ColumnsType } from 'antd/es/table';
import { useAuth } from 'components/AuthComponent';
import TransferOutgoingDocModalDetail from 'components/TransferDocModal/components/TransferOutgoingDocModalDetail';
import { PRIMARY_COLOR } from 'config/constant';
import {
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  OutgoingDocumentGetDto,
  ProcessingDocumentRoleEnum,
  UserDto,
} from 'models/doc-main-models';
import { RecoilRoot } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useOutgoingDocRes } from 'shared/hooks/OutgoingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { getStepOutgoingDocument } from 'utils/TransferDocUtils';

import Footer from './components/Footer';
import OutgoingDocumentSearchForm from './components/OutgoingDocumentSearchForm';
import { TableRowDataType } from './core/models';

import './index.css';

const OutgoingDocListPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();

  const showAlert = useSweetAlert();
  const [, setError] = useState<string>();
  const { isLoading, data } = useOutgoingDocRes();
  const [transferDocDetailModalForm] = useForm();
  const [isDetailTransferModalOpen, setIsDetailTransferModalOpen] = useState(false);

  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<OutgoingDocumentGetDto[]>([]);
  const [transferredDoc, setTransferredDoc] = useState<OutgoingDocumentGetDto>();
  const [transferDocumentDetail, setTransferDocumentDetail] =
    useState<GetTransferDocumentDetailCustomResponse>();

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
    }
  };

  const handleOnCloseDetailModal = () => {
    setIsDetailTransferModalOpen(false);
    transferDocDetailModalForm.resetFields();
  };

  // const handleDownloadAttachment = async (record: TableRowDataType) => {
  //   try {
  //     const response = await attachmentService.downloadAttachments(
  //       record.attachments,
  //       record.id.toString()
  //     );
  //
  //     if (response.status === 204) {
  //       showAlert({
  //         icon: 'error',
  //         html: t('outgoingDocListPage.message.attachment.not_found') as string,
  //         confirmButtonColor: PRIMARY_COLOR,
  //         confirmButtonText: 'OK',
  //       });
  //     } else if (response.status === 200) {
  //       attachmentService.saveZipFileToDisk(response);
  //       showAlert({
  //         icon: 'success',
  //         html: t('outgoingDocListPage.message.attachment.download_success') as string,
  //         showConfirmButton: false,
  //         timer: 2000,
  //       });
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       setError(error.response?.data.message);
  //       console.error(error.response?.data.message);
  //     } else {
  //       console.error(error);
  //     }
  //   }
  // };

  const columns: ColumnsType<TableRowDataType> = [
    {
      title: t('outgoingDocListPage.table.columns.type'),
      dataIndex: 'type',
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: t('outgoingDocListPage.table.columns.status'),
      dataIndex: 'status',
      sorter: (a, b) => a.status.localeCompare(b.status),
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
      title: t('outgoingDocListPage.table.columns.summary'),
      dataIndex: 'summary',
      width: '20%',
      render: (text) => {
        return <div dangerouslySetInnerHTML={{ __html: text }} />;
      },
    },
    {
      title: t('outgoingDocListPage.table.columns.issuePlace'),
      dataIndex: 'issuePlace',
      sorter: (a, b) => a.issuePlace.localeCompare(b.issuePlace),
    },
    {
      title: t('outgoingDocListPage.table.columns.fullText'),
      dataIndex: 'fullText',
      align: 'center',
      render: () => {
        return (
          <Tooltip
            title={t('outgoingDocListPage.table.tooltip.downloadAttachment')}
            placement='bottom'>
            <FileZipOutlined className='zip-icon' style={{ color: PRIMARY_COLOR }} />
          </Tooltip>
        );
      },
      onCell: (record) => {
        return {
          onClick: (event) => {
            event.stopPropagation();
            // handleDownloadAttachment(record);
          },
        };
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
        loading={isLoading}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              navigate(`/docout/out-detail/${record.id}`);
            },
          };
        }}
        rowClassName={() => 'row-hover'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
          getCheckboxProps: (record) => ({
            disabled: record.isDocTransferred || record.isDocCollaborator,
          }),
        }}
        columns={columns}
        dataSource={data?.payload}
        scroll={{ x: 1500 }}
        pagination={false}
        footer={() => <Footer selectedDocs={selectedDocs} setSelectedDocs={setSelectedDocs} />}
      />

      <TransferOutgoingDocModalDetail
        form={transferDocDetailModalForm}
        isModalOpen={isDetailTransferModalOpen}
        handleClose={handleOnCloseDetailModal}
        transferredDoc={transferredDoc as OutgoingDocumentGetDto}
        transferDocumentDetail={transferDocumentDetail as GetTransferDocumentDetailCustomResponse}
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
