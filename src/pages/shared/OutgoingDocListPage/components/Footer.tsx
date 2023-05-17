import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Pagination } from 'antd';
import { useForm } from 'antd/es/form/Form';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import TransferDocModal from 'components/TransferDocModal';
import { TransferDocDto } from 'models/doc-main-models';
import { useRecoilValue } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useOutgoingDocReq, useOutgoingDocRes } from 'shared/hooks/OutgoingDocumentListQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';

import { getSelectedDocsMessage } from '../core/common';
import { FooterProps } from '../core/models';
import { transferDocModalState } from '../core/states';

const Footer: React.FC<FooterProps> = ({ selectedDocs, setSelectedDocs }) => {
  const { t } = useTranslation();
  const [outgoingDocReqQuery, setOutgoingDocReqQuery] = useOutgoingDocReq();
  const { data } = useOutgoingDocRes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalForm] = useForm();
  const { currentUser } = useAuth();
  const [, setError] = useState<string>();
  const queryClient = useQueryClient();
  const showAlert = useSweetAlert();
  const transferDocModalItem = useRecoilValue(transferDocModalState);
  const transferQuerySetter = useTransferQuerySetter();
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
    const transferDocDto: TransferDocDto = {
      documentIds: selectedDocs.map((doc) => doc.id),
      summary: modalForm.getFieldValue('summary'),
      reporterId: currentUser?.id as number,
      assigneeId: modalForm.getFieldValue('assignee') as number,
      collaboratorIds: modalForm.getFieldValue('collaborators') as number[],
      processingTime: modalForm.getFieldValue('processingTime'),
      isInfiniteProcessingTime: modalForm.getFieldValue('isInfiniteProcessingTime'),
      processMethod: modalForm.getFieldValue('processMethod'),
      transferDocumentType: transferDocModalItem.transferDocumentType,
      isTransferToSameLevel: transferDocModalItem.isTransferToSameLevel,
    };

    console.log('transferDocDto', transferDocDto);

    // if (
    //   await validateTransferDocs(
    //     selectedDocs,
    //     transferDocModalItem.transferDocumentType,
    //     transferDocDto,
    //     t,
    //     currentUser
    //   )
    // ) {
    //   setIsModalOpen(false);
    //   modalForm.submit();
    //   console.log(modalForm.getFieldsValue());
    //   modalForm.resetFields();
    //   transferQuerySetter(transferDocDto);
    //   try {
    //     const response = await outgoingDocumentService.transferDocuments(transferDocDto);
    //     if (response.status === 200) {
    //       queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_LIST']);
    //       showAlert({
    //         icon: 'success',
    //         html: t('outgoingDocListPage.message.transfer_success') as string,
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
    //   setSelectedDocs([]);
    // }
  };
  const hasSelected = selectedDocs.length > 0;

  return (
    <div className='mt-5 flex justify-between'>
      <div className='float-left transfer-doc-wrapper'>
        <Button
          type='primary'
          onClick={handleOnOpenModal}
          className='transfer-doc-btn'
          disabled={!hasSelected}>
          {t('outgoing_doc_detail_page.button.report')}
        </Button>

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

      {/*<TransferDocModal*/}
      {/*  form={modalForm}*/}
      {/*  isModalOpen={isModalOpen}*/}
      {/*  handleCancel={handleOnCancelModal}*/}
      {/*  handleOk={handleOnOkModal}*/}
      {/*  selectedDocs={selectedDocs}*/}
      {/*/>*/}
    </div>
  );
};

export default Footer;