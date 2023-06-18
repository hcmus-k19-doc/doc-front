import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from 'antd';
import { AxiosError } from 'axios';
import { IncomingDocumentDto } from 'models/doc-main-models';
import { DocSystemRoleEnum } from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { validateDocBeforeClose } from 'shared/validators/TransferDocValidator';

import { useAuth } from '../AuthComponent';

export interface DocButtonListProps {
  isEditing: boolean;
  enableEditing: () => void;
  onFinishEditing: () => void;
  documentDetail?: IncomingDocumentDto;
  onOpenTransferModal?: () => void;
}

const DocButtonList = ({
  enableEditing,
  isEditing,
  onFinishEditing,
  documentDetail,
  onOpenTransferModal,
}: DocButtonListProps) => {
  const { currentUser } = useAuth();
  const { docId } = useParams();
  const showAlert = useSweetAlert();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // TODO: Move this function to detail page
  async function onFinishDocument() {
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
  }

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
    <Button type='primary' key='3' size='large' className='mr-5' name='report'>
      {t('incomingDocDetailPage.button.report')}
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
      ...buttonArr,
      currentUser?.role === DocSystemRoleEnum.CHUYEN_VIEN && (
        <Button type='primary' size='large' key='10' name='end' onClick={onFinishDocument}>
          {t('incomingDocDetailPage.button.end')}
        </Button>
      ),
    ];
  };

  return <>{renderButtons()}</>;
};

export default DocButtonList;
