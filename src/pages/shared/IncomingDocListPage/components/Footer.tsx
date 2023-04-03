import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Pagination } from 'antd';
import { useIncomingDocReq, useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';

const Footer = () => {
  const { t } = useTranslation();
  const [incomingDocReqQuery, setIncomingDocReqQuery] = useIncomingDocReq();
  const { data } = useIncomingDocRes();

  const handleOnChange = (page: number, pageSize: number) => {
    setIncomingDocReqQuery({ ...incomingDocReqQuery, page, pageSize });
  };

  return (
    <div className='mt-5 flex justify-between'>
      <Button type='primary'>{t('MAIN_PAGE.BUTTON.REPORT_TO_LEADER')}</Button>

      <Pagination
        current={incomingDocReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        showTotal={(total) => t('COMMON.PAGINATION.SHOW_TOTAL', { total })}
      />
    </div>
  );
};

export default Footer;
