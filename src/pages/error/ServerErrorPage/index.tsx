import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';

const ServerErrorPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onGoBack = () => {
    navigate(-1);
  };

  return (
    <Result
      status='500'
      title={t('internal_server_error_page.title')}
      subTitle={t('internal_server_error_page.message')}
      extra={
        <Button type='primary' onClick={onGoBack}>
          {t('internal_server_error_page.go_back_button')}
        </Button>
      }
    />
  );
};

export default ServerErrorPage;
