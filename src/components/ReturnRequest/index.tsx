import { useEffect, useState } from 'react';
import { Collapse } from 'antd';
import { t } from 'i18next';
import { ReturnRequestGetDto, ReturnRequestType } from 'models/doc-main-models';
import returnRequestService from 'services/ReturnRequestService';

import { ReturnRequestProps } from './core/models';

import './index.css';
const { Panel } = Collapse;

export default function ReturnRequest({ docId, processingDocumentType }: ReturnRequestProps) {
  const [returnRequests, setReturnRequests] = useState<ReturnRequestGetDto[]>([]);

  useEffect(() => {
    // call return request api
    returnRequestService
      .getReturnRequests(processingDocumentType, docId)
      .then((res) => {
        console.log(res);
        setReturnRequests(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [docId, processingDocumentType]);

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  const renderWithdrawPanel = (returnRequest: ReturnRequestGetDto) => {
    return (
      <Panel
        header={t('return_request.withdraw_message', {
          sender: docId,
          documentId: docId,
        })}
        key={returnRequest.id}>
        <p>
          {t('return_request.withdraw_message', {
            sender: docId,
            documentId: docId,
          })}
        </p>
      </Panel>
    );
  };

  const renderSendbackPanel = (returnRequest: ReturnRequestGetDto) => {
    return (
      <Panel
        header={t('return_request.send_back_message', {
          sender: docId,
          documentId: docId,
          receiver: docId,
        })}
        key={returnRequest.id}>
        <p>
          {t('return_request.send_back_message', {
            sender: docId,
            documentId: docId,
            receiver: docId,
          })}
        </p>
      </Panel>
    );
  };

  if (returnRequests?.length <= 0) {
    return null;
  }

  return (
    <Collapse defaultActiveKey={[]} onChange={onChange} className='mb-10'>
      <Panel
        header={<span className='custom-panel-header'>{t('return_request.title')}</span>}
        key='1-DEFAULT'>
        <Collapse>
          {returnRequests.map((item) => {
            if (item.returnRequestType === ReturnRequestType.WITHDRAW) {
              return renderWithdrawPanel(item);
            } else {
              return renderSendbackPanel(item);
            }
          })}
        </Collapse>
      </Panel>
    </Collapse>
  );
}
