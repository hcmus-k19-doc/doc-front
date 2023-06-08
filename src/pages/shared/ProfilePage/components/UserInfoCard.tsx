import React from 'react';
import { Card, Descriptions } from 'antd';
import { useAuth } from 'components/AuthComponent';
import { t } from 'i18next';

import '../index.css';

export default function UserInfoCard() {
  const { currentUser } = useAuth();

  return (
    <Card className='shadow-xl drop-shadow-2xl rounded-lg h-full'>
      <Descriptions column={1} title={t('profile.user.info')} className='mx-2'>
        <Descriptions.Item label={t('profile.user.id')}>{currentUser?.id}</Descriptions.Item>
        <Descriptions.Item label={t('profile.user.username')}>
          {currentUser?.username}
        </Descriptions.Item>
        <Descriptions.Item label={t('profile.user.email')}>{currentUser?.email}</Descriptions.Item>
        <Descriptions.Item label={t('profile.user.role')}>
          {t(`user.role.${currentUser?.role}`)}
        </Descriptions.Item>
        <Descriptions.Item label={t('profile.user.department')}>
          {currentUser?.department.departmentName}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
