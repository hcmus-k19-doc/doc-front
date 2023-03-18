import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

const ErrorComponent: React.FC = () => {
  const navigate = useNavigate();
  const handleBackHome = () => {
    navigate('/');
  };
  return (
    <Result
      status='500'
      title='500'
      subTitle='Sorry, something went wrong.'
      extra={
        <Button type='primary' onClick={handleBackHome}>
          Back Home
        </Button>
      }
    />
  );
};

export default ErrorComponent;
