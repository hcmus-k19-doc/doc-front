import React from 'react';
import { Button, Result } from 'antd';
import { t } from 'i18next';
import { globalNavigate } from 'utils/RoutingUtils';

const ServerErrorPage: React.FC = () => (
  <Result
    status='500'
    title='500'
    subTitle={t('doc.exception.internal_server_error')}
    extra={
      <Button type='primary' onClick={() => globalNavigate('/')}>
        Back Home
      </Button>
    }
  />
);

export default ServerErrorPage;
