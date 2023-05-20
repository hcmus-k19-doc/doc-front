import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'antd';
import { AxiosError } from 'axios';
import { t } from 'i18next';
import { IncomingDocumentDto } from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useSweetAlert } from 'shared/hooks/SwalAlert';

import { DocSystemRoleEnum } from '../../models/doc-main-models';
import { useAuth } from '../AuthComponent';

export interface DocButtonListProps {
  roleNumber: number;
  isEditing: boolean;
  enableEditing: () => void;
  onFinishEditing: () => void;
  documentDetail?: IncomingDocumentDto;
  onOpenTransferModal?: () => void;
}

const DocButtonList = ({
  enableEditing,
  roleNumber,
  isEditing,
  onFinishEditing,
  documentDetail,
  onOpenTransferModal,
}: DocButtonListProps) => {
  const [buttonDisplayArr, setButtonDisplayArr] = useState<boolean[]>([]);
  const { currentUser } = useAuth();
  const { docId } = useParams();
  const showAlert = useSweetAlert();

  async function onFinishDocument() {
    try {
      const message = await incomingDocumentService.closeDocument(Number(docId));
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

  const buttonArr: JSX.Element[] = [
    <Button
      type='primary'
      key='1'
      size='large'
      name='edit'
      onClick={isEditing ? onFinishEditing : enableEditing}>
      {isEditing ? t('incomingDocDetailPage.button.save') : t('incomingDocDetailPage.button.edit')}
    </Button>,
    <Button type='primary' key='2' size='large' name='collect'>
      {t('incomingDocDetailPage.button.collect')}
    </Button>,
    <Button type='primary' key='3' size='large' name='report'>
      {t('incomingDocDetailPage.button.report')}
    </Button>,
    <Button type='primary' size='large' key='4' name='transfer' onClick={onOpenTransferModal}>
      {documentDetail?.isDocTransferred
        ? t('incomingDocDetailPage.button.transer_detail')
        : t('incomingDocDetailPage.button.transfer')}
    </Button>,
    <Button type='primary' size='large' key='5' name='assign'>
      {t('incomingDocDetailPage.button.assign')}
    </Button>,
    <Button type='primary' size='large' key='6' name='comment'>
      {t('incomingDocDetailPage.button.comment')}
    </Button>,
    <Button type='primary' size='large' key='7' name='confirm'>
      {t('incomingDocDetailPage.button.confirm')}
    </Button>,
    <Button type='primary' size='large' key='8' name='return'>
      {t('incomingDocDetailPage.button.return')}
    </Button>,
  ];

  const shareButtonArr: JSX.Element[] = [
    <Button type='primary' size='large' key='9' name='extend' className='mr-5'>
      {t('incomingDocDetailPage.button.extend')}
    </Button>,
  ];

  const resolveButtons = (roleNumber: number) => {
    const arr: boolean[] = [];
    for (let i = 0; i < 9; i++) {
      if ((roleNumber >> (8 - i)) & 1) {
        arr.push(true);
      } else {
        arr.push(false);
      }
    }

    arr[2] = false;

    setButtonDisplayArr(arr);
  };

  const renderButtons = () => {
    const displayArr = buttonDisplayArr.map((item, index) => {
      if (item) {
        return (
          <React.Fragment key={index}>
            {buttonArr[index]}
            {index === buttonDisplayArr.length - 1 ? null : <span className='mr-5'></span>}
          </React.Fragment>
        );
      }
    });

    return [
      ...displayArr,
      ...shareButtonArr,
      currentUser?.role === DocSystemRoleEnum.CHUYEN_VIEN && (
        <Button
          type='primary'
          size='large'
          key='10'
          name='end'
          className='mr-5'
          onClick={onFinishDocument}>
          {t('incomingDocDetailPage.button.end')}
        </Button>
      ),
    ];
  };

  useEffect(() => {
    resolveButtons(roleNumber);
  }, [roleNumber]);

  return <>{renderButtons()}</>;
};

export default DocButtonList;
