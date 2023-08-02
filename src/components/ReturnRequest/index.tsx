import { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { t } from 'i18next';
import { ReturnRequestGetDto } from 'models/doc-main-models';
import returnRequestService from 'services/ReturnRequestService';

import { ReturnRequestProps } from './core/models';

import './index.css';
const { Panel } = Collapse;
export default function ReturnRequest({ docId, processingDocumentType }: ReturnRequestProps) {
  const [returnRequest, setReturnRequest] = useState<ReturnRequestGetDto[]>([]);

  useEffect(() => {
    // call return request api
    returnRequestService
      .getReturnRequests(processingDocumentType, docId)
      .then((res) => {
        console.log(res);
        setReturnRequest(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [docId, processingDocumentType]);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  if (returnRequest?.length <= 0) {
    return null;
  }

  return (
    <Collapse defaultActiveKey={[]} onChange={onChange} className='mb-10'>
      <Panel
        header={<span className='custom-panel-header'>{t('return_request.title')}</span>}
        key='2'>
        <Collapse>
          <Panel header='Nested Panel 1' key='2-1'>
            <p>This is the content of Nested Panel 1</p>
          </Panel>
          <Panel header='Nested Panel 2' key='2-2'>
            <p>This is the content of Nested Panel 2</p>
          </Panel>
        </Collapse>
      </Panel>
    </Collapse>
  );
}
