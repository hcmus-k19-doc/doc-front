import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Button, message, Pagination } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import TransferDocModal from 'components/TransferDocModal';
import { TransferDocDto } from 'models/doc-main-models';
import { useRecoilValue } from 'recoil';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useIncomingDocReq, useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';

import { getSelectedDocsMessage } from '../core/common';
import { FooterProps } from '../core/models';
import { transferDocModalState } from '../core/states';

const Footer: React.FC<FooterProps> = ({ selectedDocs, setSelectedDocs, csvData }) => {
  const { t } = useTranslation();
  const [incomingDocReqQuery, setIncomingDocReqQuery] = useIncomingDocReq();
  const { data } = useIncomingDocRes(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalForm] = useForm();
  const { currentUser } = useAuth();
  const [, setError] = useState<string>();
  const queryClient = useQueryClient();
  const showAlert = useSweetAlert();
  const transferDocModalItem = useRecoilValue(transferDocModalState);
  const transferQuerySetter = useTransferQuerySetter();
  const handleOnChange = (page: number, pageSize: number) => {
    setSelectedDocs([]);
    setIncomingDocReqQuery({ ...incomingDocReqQuery, page, pageSize });
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
      processingMethod: modalForm.getFieldValue('processingMethod'),
      transferDocumentType: transferDocModalItem.transferDocumentType,
      isTransferToSameLevel: transferDocModalItem.isTransferToSameLevel,
    };

    if (
      await validateTransferDocs(
        selectedDocs,
        transferDocModalItem.transferDocumentType,
        transferDocDto,
        t,
        currentUser
      )
    ) {
      modalForm.submit();
      setIsSubmitLoading(true);
      transferQuerySetter(transferDocDto);
      try {
        const response = await incomingDocumentService.transferDocuments(transferDocDto);
        if (response.status === 200) {
          queryClient.invalidateQueries(['QUERIES.INCOMING_DOCUMENT_LIST']);
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
      setIsSubmitLoading(false);
      modalForm.resetFields();
      setIsModalOpen(false);
      setSelectedDocs([]);
    }
  };
  const hasSelected = selectedDocs.length > 0;

  const headers = [
    {
      label: t('incomingDocListPage.table.columns.ordinalNumber'),
      key: 'ordinalNumber',
    },
    {
      label: t('incomingDocListPage.table.columns.arriveId'),
      key: 'arriveId',
    },
    {
      label: t('incomingDocListPage.table.columns.originId'),
      key: 'originId',
    },
    {
      label: t('incomingDocListPage.table.columns.name'),
      key: 'name',
    },
    {
      label: t('incomingDocListPage.table.columns.type'),
      key: 'type',
    },
    {
      label: t('incomingDocListPage.table.columns.arriveDate'),
      key: 'arriveDate',
    },
    {
      label: t('incomingDocListPage.table.columns.issuePlace'),
      key: 'issuePlace',
    },
    {
      label: t('incomingDocListPage.table.columns.status'),
      key: 'status',
    },
    {
      label: t('incomingDocListPage.table.columns.deadline'),
      key: 'deadline',
    },
  ];

  return (
    <div className='mt-5 flex justify-between'>
      <div className='float-left transfer-doc-wrapper'>
        <div style={{ marginTop: 0 }}>
          <Button type='primary' style={{ marginRight: '0.5rem' }} className='transfer-doc-btn'>
            <CSVLink
              filename={`${t('incomingDocListPage.message.file_name')}`}
              headers={headers}
              data={csvData || []}
              onClick={() => {
                message.success(
                  `${t('incomingDocListPage.message.file_name')} ${t(
                    'incomingDocListPage.message.file_downloading'
                  )}`
                );
              }}>
              {t('incomingDocDetailPage.button.export')}
            </CSVLink>
          </Button>
          <Button
            type='primary'
            onClick={handleOnOpenModal}
            className='transfer-doc-btn'
            disabled={!hasSelected}>
            {t('incomingDocDetailPage.button.transfer')}
          </Button>
        </div>

        <span style={{ marginTop: 8 }}>
          {hasSelected
            ? t('incomingDocListPage.message.selected_docs.summary', {
                count: hasSelected ? selectedDocs.length : 0,
                ...getSelectedDocsMessage(selectedDocs, t),
              })
            : ''}
        </span>
      </div>

      <Pagination
        current={incomingDocReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('common.pagination.show_total', { total })}
      />

      <TransferDocModal
        form={modalForm}
        isModalOpen={isModalOpen}
        isSubmitLoading={isSubmitLoading}
        handleCancel={handleOnCancelModal}
        handleOk={handleOnOkModal}
        selectedDocs={selectedDocs}
        type={'IncomingDocument'}
      />
    </div>
  );
};

export default Footer;
