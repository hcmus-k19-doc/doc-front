import React from 'react';
import { Card, Descriptions } from 'antd';
import { t } from 'i18next';

export default function LogInfoCard() {
  return (
    <Card className='shadow-xl drop-shadow-2xl rounded-lg'>
      <Descriptions title={t('profile.log.title')}></Descriptions>
    </Card>
  );
}
