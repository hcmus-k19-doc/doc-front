import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Modal, Typography } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios, { AxiosError } from 'axios';
import {
  GetTransferDocumentDetailCustomResponse,
  IncomingDocumentDto,
  ProcessingDocumentTypeEnum,
  ReturnRequestPostDto,
  ReturnRequestType,
  UserDto,
} from 'models/doc-main-models';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import returnRequestService from 'services/ReturnRequestService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { validateDocBeforeClose } from 'shared/validators/TransferDocValidator';
import { getStep } from 'utils/TransferDocUtils';

import { PRIMARY_COLOR } from '../../config/constant';
import { useAuth } from '../AuthComponent';

export interface DocButtonListProps {
  isEditing: boolean;
  isClosed: boolean;
  isSaving: boolean;
  enableEditing: () => void;
  onFinishEditing: () => void;
  documentDetail?: IncomingDocumentDto;
  onOpenTransferModal?: () => void;
  transferDocumentDetail: GetTransferDocumentDetailCustomResponse;
  isLoading: boolean;
  setIsLoading: any;
  handleLoadTransferDocumentDetail: (callback: () => void) => Promise<void>;
}
const { Title } = Typography;
const { confirm } = Modal;

const DocButtonList = ({
  enableEditing,
  isEditing,
  onFinishEditing,
  documentDetail,
  onOpenTransferModal,
  isClosed,
  isSaving,
  transferDocumentDetail,
  isLoading,
  setIsLoading,
  handleLoadTransferDocumentDetail,
}: DocButtonListProps) => {
  const { currentUser } = useAuth();
  const { docId } = useParams();
  const showAlert = useSweetAlert();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);

  const [returnType, setReturnType] = useState<ReturnRequestType>(ReturnRequestType.SEND_BACK);
  const [isReturnRequestModalOpen, setIsReturnRequestModalOpen] = useState<boolean>(false);
  const [returnRequestReason, setReturnRequestReason] = useState<string>('');

  const showReturnRequestModal = async () => {
    setIsReturnRequestModalOpen(true);
    await handleLoadTransferDocumentDetail(hideReturnRequestModal);
  };

  const hideReturnRequestModal = () => {
    setIsReturnRequestModalOpen(false);
  };

  const onReturnRequestReasonChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReturnRequestReason(e.target.value);
  };

  const handleReturnRequest = async () => {
    const returnRequestPostDto: ReturnRequestPostDto = {
      currentProcessingUserId: transferDocumentDetail?.assigneeId || -1,
      previousProcessingUserId: currentUser?.id || -1,
      documentIds: [documentDetail?.id || -1],
      documentType: ProcessingDocumentTypeEnum.INCOMING_DOCUMENT,
      reason: returnRequestReason,
      step: getStep(currentUser as UserDto, null, true),
      returnRequestType: returnType,
    };
    if (returnType === ReturnRequestType.SEND_BACK) {
      returnRequestPostDto.currentProcessingUserId = currentUser?.id || -1;
      returnRequestPostDto.previousProcessingUserId = -1;
      returnRequestPostDto.step = getStep(currentUser as UserDto, null, false);
    }
    setIsLoading(true);
    try {
      const response = await returnRequestService.createReturnRequest(returnRequestPostDto);

      showAlert({
        icon: 'success',
        html:
          returnType === ReturnRequestType.WITHDRAW
            ? t('withdraw.success')
            : t('send_back.success'),
        showConfirmButton: true,
      });
      setReturnRequestReason('');
      hideReturnRequestModal();
      queryClient.invalidateQueries(['QUERIES.INCOMING_DOCUMENT_DETAIL', +(docId || 1)]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showAlert({
          icon: 'warning',
          html: t(
            error.response?.data.message ||
              (returnType === ReturnRequestType.WITHDRAW ? 'withdraw.error' : 'send_back.error')
          ),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } else {
        console.error(error);
      }
      queryClient.invalidateQueries(['QUERIES.INCOMING_DOCUMENT_DETAIL', +(docId || 1)]);
      hideReturnRequestModal();
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Move this function to detail page
  async function finishDocument() {
    setIsClosing(true);
    if (validateDocBeforeClose(documentDetail, currentUser, t)) {
      try {
        const message = await incomingDocumentService.closeDocument(Number(docId));
        queryClient.invalidateQueries(['QUERIES.INCOMING_DOCUMENT_DETAIL', Number(docId)]);
        showAlert({
          icon: 'success',
          html: t(message),
          showConfirmButton: true,
        });
      } catch (e) {
        if (e instanceof AxiosError) {
          showAlert({
            icon: 'error',
            html: t(e.response?.data.message),
            showConfirmButton: true,
          });
        }
      }
    }
    setIsClosing(false);
  }

  const onFinishDocumentConfirm = () => {
    confirm({
      icon: <QuestionCircleOutlined style={{ color: PRIMARY_COLOR }} />,
      content: <div className='mt-3'>{t('incomingDocDetailPage.message.confirm_finish')}</div>,
      okText: t('incomingDocDetailPage.button.end'),
      cancelText: t('incomingDocDetailPage.button.cancel'),
      onOk: finishDocument,
    });
  };

  const buttonArr: JSX.Element[] = [
    <Button
      type='primary'
      key='1'
      size='large'
      className='mr-5'
      name='edit'
      onClick={isEditing ? onFinishEditing : enableEditing}>
      {isEditing ? t('incomingDocDetailPage.button.save') : t('incomingDocDetailPage.button.edit')}
    </Button>,
    <Button
      type='primary'
      size='large'
      className='mr-5'
      key='4'
      name='transfer'
      onClick={onOpenTransferModal}>
      {documentDetail?.isDocTransferred || documentDetail?.isDocCollaborator
        ? t('incomingDocDetailPage.button.transer_detail')
        : t('incomingDocDetailPage.button.transfer')}
    </Button>,
  ];

  const renderButtons = () => {
    return [
      // ...buttonArr,
      !isClosed && (
        <Button
          type='primary'
          key='1'
          size='large'
          className='mr-5'
          name='edit'
          loading={isSaving || isClosing}
          onClick={isEditing ? onFinishEditing : enableEditing}>
          {isEditing
            ? t('incomingDocDetailPage.button.save')
            : t('incomingDocDetailPage.button.edit')}
        </Button>
      ),
      !isClosed
        ? documentDetail?.isTransferable && (
            <Button
              type='primary'
              size='large'
              className='mr-5'
              key='4'
              name='transfer'
              hidden={isEditing}
              loading={isClosing}
              onClick={onOpenTransferModal}>
              {documentDetail?.isDocTransferred || documentDetail?.isDocCollaborator
                ? t('incomingDocDetailPage.button.transer_detail')
                : t('incomingDocDetailPage.button.transfer')}
            </Button>
          )
        : (documentDetail?.isDocTransferred || documentDetail?.isDocCollaborator) && (
            <Button
              type='primary'
              size='large'
              className='mr-5'
              key='4'
              name='transfer'
              hidden={isEditing}
              loading={isClosing}
              onClick={onOpenTransferModal}>
              {t('incomingDocDetailPage.button.transer_detail')}
            </Button>
          ),
      currentUser?.role === DocSystemRoleEnum.CHUYEN_VIEN && documentDetail?.isCloseable && (
        <Button
          type='primary'
          size='large'
          key='10'
          name='end'
          loading={isClosing}
          className='mr-5'
          onClick={onFinishDocumentConfirm}
          hidden={isEditing}>
          {t('incomingDocDetailPage.button.end')}
        </Button>
      ),
      currentUser?.role !== DocSystemRoleEnum.CHUYEN_VIEN &&
        documentDetail?.isDocTransferredByNextUserInFlow === false &&
        !documentDetail?.isDocCollaborator &&
        documentDetail?.isDocTransferred && (
          <Button
            key='widthdraw'
            type='primary'
            size='large'
            onClick={() => {
              setReturnType(ReturnRequestType.WITHDRAW);
              showReturnRequestModal();
            }}
            className='danger-button'
            loading={isLoading || isSaving || isClosing}>
            {t('transfer_modal.button.withdraw')}
          </Button>
        ),
      currentUser?.role !== DocSystemRoleEnum.VAN_THU &&
        documentDetail?.isDocTransferred === false &&
        !documentDetail?.isDocCollaborator &&
        documentDetail?.isTransferable && (
          <Button
            key='send_back'
            type='primary'
            size='large'
            onClick={() => {
              setReturnType(ReturnRequestType.SEND_BACK);
              showReturnRequestModal();
            }}
            className='danger-button'
            loading={isLoading || isSaving || isClosing}>
            {t('transfer_modal.button.send_back')}
          </Button>
        ),
    ];
  };

  return (
    <>
      {renderButtons()}
      <Modal
        title=''
        centered
        open={isReturnRequestModalOpen}
        onOk={handleReturnRequest}
        okText={t('transfer_modal.button.ok')}
        cancelText={t('transfer_modal.button.cancel')}
        onCancel={hideReturnRequestModal}
        // bodyStyle={{ marginBottom: 20 }}
        cancelButtonProps={{ loading: isLoading }}
        confirmLoading={isLoading}>
        <Title level={5}>
          {returnType === ReturnRequestType.WITHDRAW
            ? t('withdraw.input_reason')
            : t('send_back.input_reason')}
        </Title>
        <TextArea
          // showCount
          maxLength={200}
          style={{ height: 100, resize: 'none' }}
          onChange={onReturnRequestReasonChange}
          value={returnRequestReason}
          allowClear
        />
      </Modal>
    </>
  );
};

export default DocButtonList;
