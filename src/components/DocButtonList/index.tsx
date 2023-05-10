import { useEffect, useState } from 'react';
import React from 'react';
import { Button } from 'antd';
import { t } from 'i18next';

export interface DocButtonListProps {
  roleNumber: number;
  isEditing: boolean;
  enableEditing: () => void;
  onFinishEditing: () => void;
}

const DocButtonList = ({
  enableEditing,
  roleNumber,
  isEditing,
  onFinishEditing,
}: DocButtonListProps) => {
  const [buttonDisplayArr, setButtonDisplayArr] = useState<boolean[]>([]);

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
    <Button type='primary' size='large' key='4' name='transfer'>
      {t('incomingDocDetailPage.button.transfer')}
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
    <Button type='primary' size='large' key='9' name='extend'>
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

    setButtonDisplayArr(arr);
  };

  const renderButtons = () => {
    return buttonDisplayArr.map((item, index) => {
      if (item) {
        return (
          <React.Fragment key={index}>
            {buttonArr[index]}
            {index === buttonDisplayArr.length - 1 ? null : <span className='mr-5'></span>}
          </React.Fragment>
        );
      }
    });
  };

  useEffect(() => {
    resolveButtons(roleNumber);
  }, [roleNumber]);

  return <>{renderButtons()}</>;
};

export default DocButtonList;
