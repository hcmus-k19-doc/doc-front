import React, { useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Pagination } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import TransferDocModal from 'components/TransferDocModal';
import {
  DocSystemRoleEnum,
  OutgoingDocumentGetListDto,
  TransferDocDto,
} from 'models/doc-main-models';
import { transferDocModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { useRecoilValue } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useOutgoingDocReq, useOutgoingDocRes } from 'shared/hooks/OutgoingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';
import {
  DAY_MONTH_YEAR_FORMAT,
  formatDateToDDMMYYYY,
  isFutureOrPresent,
  isValidDateFormat,
} from 'utils/DateTimeUtils';

import { PRIMARY_COLOR } from '../../../../config/constant';
import { getSelectedDocsMessage } from '../core/common';
import { FooterProps } from '../core/models';

const Footer: React.FC<FooterProps> = ({ selectedDocs, setSelectedDocs }) => {
  const { t } = useTranslation();
  const [outgoingDocReqQuery, setOutgoingDocReqQuery] = useOutgoingDocReq();
  const { data } = useOutgoingDocRes(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [modalForm] = useForm();
  const { currentUser } = useAuth();
  const [, setError] = useState<string>();
  const queryClient = useQueryClient();
  const showAlert = useSweetAlert();
  const transferDocModalItem = useRecoilValue(transferDocModalState);
  const transferQuerySetter = useTransferQuerySetter();
  const [csvData, setCsvData] = useState<OutgoingDocumentGetListDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const handleOnChange = (page: number, pageSize: number) => {
    setSelectedDocs([]);
    setOutgoingDocReqQuery({ ...outgoingDocReqQuery, page, pageSize });
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
    if (!isValidDateFormat(modalForm.getFieldValue('processingTime'))) {
      modalForm.setFieldsValue({
        processingTime: formatDateToDDMMYYYY(modalForm.getFieldValue('processingTime')),
      });
    }

    if (!isFutureOrPresent(modalForm.getFieldValue('processingTime'))) {
      return;
    }

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
        const response = await outgoingDocumentService.transferDocuments(transferDocDto);
        if (response.status === 200) {
          queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_LIST']);
          currentUser?.role !== DocSystemRoleEnum.HIEU_TRUONG
            ? showAlert({
                icon: 'success',
                html: t('outgoing_doc_detail_page.message.report_success') as string,
                showConfirmButton: false,
                timer: 2000,
              })
            : showAlert({
                icon: 'success',
                html: t('outgoing_doc_detail_page.message.transfer_secretary_success') as string,
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

  const fetchDataCSV = async () => {
    await outgoingDocumentService
      .getAllOutgoingDocuments({
        releaseDateFrom: outgoingDocReqQuery.releaseDate?.[0].format(DAY_MONTH_YEAR_FORMAT),
        releaseDateTo: outgoingDocReqQuery.releaseDate?.[1].format(DAY_MONTH_YEAR_FORMAT),
        ...outgoingDocReqQuery,
      })
      .then((data) => {
        data.forEach((item) => {
          item.outgoingNumber = item.outgoingNumber !== null ? `'${item.outgoingNumber}'` : '';
          item.status = t(`PROCESSING_STATUS.${item.status}`);
          item.customProcessingDuration =
            item.customProcessingDuration !== '' ? `'${item.customProcessingDuration}'` : '';
        });
        setCsvData(data);
      });
  };

  useEffect(() => {
    fetchDataCSV();
  }, [outgoingDocReqQuery]);

  const handleExportToCSV = async () => {
    setIsLoading(true);
    try {
      await fetchDataCSV();
      await showAlert({
        icon: 'success',
        html:
          t('outgoingDocListPage.message.file_name') +
          ' ' +
          t('outgoingDocListPage.message.file_downloaded'),
        showConfirmButton: true,
      });
    } catch (error) {
      await showAlert({
        icon: 'error',
        html: t('outgoingDocListPage.message.file_download_failed'),
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const headers = [
    {
      label: t('outgoingDocListPage.table.columns.ordinalNumber'),
      key: 'ordinalNumber',
    },
    {
      label: t('outgoingDocListPage.table.columns.name'),
      key: 'name',
    },
    {
      label: t('outgoingDocListPage.table.columns.originId'),
      key: 'originalSymbolNumber',
    },
    {
      label: t('outgoingDocListPage.table.columns.release_number'),
      key: 'outgoingNumber',
    },
    {
      label: t('outgoingDocListPage.table.columns.type'),
      key: 'documentTypeName',
    },
    {
      label: t('outgoingDocListPage.table.columns.status'),
      key: 'status',
    },
    {
      label: t('outgoingDocListPage.table.columns.issuePlace'),
      key: 'publishingDepartmentName',
    },
    {
      label: t('outgoingDocListPage.table.columns.summary'),
      key: 'summary',
    },
    {
      label: t('outgoingDocListPage.table.columns.deadline'),
      key: 'customProcessingDuration',
    },
  ];

  return (
    <div className='mt-5 flex justify-between'>
      <div className='float-left transfer-doc-wrapper'>
        <div style={{ marginTop: 0 }}>
          <Button
            type='primary'
            style={{ marginRight: '0.5rem' }}
            className='transfer-doc-btn'
            loading={isLoading}>
            <CSVLink
              filename={`${t('outgoingDocListPage.message.file_name')}`}
              headers={headers}
              data={csvData}
              onClick={handleExportToCSV}>
              {t('outgoing_doc_detail_page.button.export')}
            </CSVLink>
          </Button>
          <Button
            type='primary'
            onClick={handleOnOpenModal}
            className='transfer-doc-btn'
            style={currentUser?.role !== DocSystemRoleEnum.VAN_THU ? {} : { display: 'none' }}
            disabled={!hasSelected}>
            {currentUser?.role === DocSystemRoleEnum.HIEU_TRUONG
              ? t('outgoing_doc_detail_page.button.transfer_secretary')
              : t('outgoing_doc_detail_page.button.report')}
          </Button>
        </div>

        <span style={{ marginTop: 8 }}>
          {hasSelected
            ? t('outgoingDocListPage.message.selected_docs.summary', {
                count: hasSelected ? selectedDocs.length : 0,
                ...getSelectedDocsMessage(selectedDocs, t),
              })
            : ''}
        </span>
      </div>

      <Pagination
        current={outgoingDocReqQuery.page}
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
        type={'OutgoingDocument'}
      />
    </div>
  );
};

export default Footer;
