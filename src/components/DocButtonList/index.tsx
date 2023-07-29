import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'antd';
import { AxiosError } from 'axios';
import { IncomingDocumentDto } from 'models/doc-main-models';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { validateDocBeforeClose } from 'shared/validators/TransferDocValidator';

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
}

const { confirm } = Modal;

const DocButtonList = ({
  enableEditing,
  isEditing,
  onFinishEditing,
  documentDetail,
  onOpenTransferModal,
  isClosed,
  isSaving,
}: DocButtonListProps) => {
  const { currentUser } = useAuth();
  const { docId } = useParams();
  const showAlert = useSweetAlert();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isClosing, setIsClosing] = useState(false);

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
          onClick={onFinishDocumentConfirm}
          hidden={isEditing}>
          {t('incomingDocDetailPage.button.end')}
        </Button>
      ),
    ];
  };

  return <>{renderButtons()}</>;
};

export default DocButtonList;
