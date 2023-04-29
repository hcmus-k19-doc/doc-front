import React from 'react';
import { Button, Result } from 'antd';
import { globalNavigate } from 'utils/RoutingUtils';

const ServerErrorPage: React.FC = () => (
  <Result
    status='500'
    title='500'
    subTitle='Sorry, something went wrong.'
    extra={
      <Button type='primary' onClick={() => globalNavigate('/')}>
        Back Home
      </Button>
    }
  />
);

export default ServerErrorPage;
