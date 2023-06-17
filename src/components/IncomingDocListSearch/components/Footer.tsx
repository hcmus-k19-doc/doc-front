import React from 'react';
import { Pagination } from 'antd';
import { useIncomingDocReq, useIncomingDocRes } from 'shared/hooks/IncomingDocumentListQuery';
import { PAGE_SIZE_MODAL } from 'shared/models/states';

const Footer: React.FC = () => {
  const [incomingDocReqQuery, setIncomingDocReqQuery] = useIncomingDocReq();
  const { data } = useIncomingDocRes(true);

  const handleOnChange = (page: number, pageSize: number) => {
    setIncomingDocReqQuery({ ...incomingDocReqQuery, page, pageSize });
  };

  return (
    <div className='flex justify-end'>
      <Pagination
        current={incomingDocReqQuery.page}
        defaultCurrent={1}
        onChange={handleOnChange}
        total={data?.totalElements}
        pageSize={PAGE_SIZE_MODAL}
        pageSizeOptions={['5']}
      />
    </div>
  );
};

export default Footer;
