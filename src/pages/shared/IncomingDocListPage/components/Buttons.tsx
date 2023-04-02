import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, FormInstance } from 'antd';

interface Props {
  form: FormInstance;
}

const Buttons = ({ form }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item>
        <Button className='px-8' htmlType='submit' type='primary'>
          {t('COMMON.SEARCH_CRITERIA.SEARCH')}
        </Button>
      </Form.Item>
      <Form.Item>
        <Button
          onClick={() => form.resetFields()}
          htmlType='submit'
          type='default'
          className='px-8 reset-btn'>
          {t('COMMON.SEARCH_CRITERIA.RESET')}
        </Button>
      </Form.Item>
    </>
  );
};

export default Buttons;
