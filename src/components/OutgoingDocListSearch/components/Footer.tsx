import React from 'react';
import { Pagination } from 'antd';
import { useOutgoingDocReq, useOutgoingDocRes } from 'shared/hooks/OutgoingDocumentListQuery';
import { PAGE_SIZE_MODAL } from 'shared/models/states';

const Footer: React.FC = () => {
  const [outgoingDocReqQuery, setOutgoingDocReqQuery] = useOutgoingDocReq();
  const { data } = useOutgoingDocRes(true);

  const handleOnChange = (page: number, pageSize: number) => {
    setOutgoingDocReqQuery({ ...outgoingDocReqQuery, page, pageSize });
  };

  return (
    <div className='flex justify-end'>
      <Pagination
        current={outgoingDocReqQuery.page}
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
