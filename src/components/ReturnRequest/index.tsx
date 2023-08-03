import { useEffect, useState } from 'react';
import { Col, Collapse, Row, Typography } from 'antd';
import { useAuth } from 'components/AuthComponent';
import { t } from 'i18next';
import { ReturnRequestGetDto, ReturnRequestType } from 'models/doc-main-models';
import returnRequestService from 'services/ReturnRequestService';

import { ReturnRequestProps } from './core/models';

import './index.css';
const { Panel } = Collapse;
const { Text } = Typography;
export default function ReturnRequest({ docId, processingDocumentType }: ReturnRequestProps) {
  const [returnRequests, setReturnRequests] = useState<ReturnRequestGetDto[]>([]);
  const { currentUser } = useAuth();

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

  const renderPanelContent = (returnRequest: ReturnRequestGetDto) => {
    return (
      <Row>
        <Col span={12}>
          <Row className='mb-3'>
            <Col span='4'>
              <Text strong>{`${t('return_request.return_request_sender')}:`}</Text>
            </Col>
            <Col span='20'>
              {returnRequest?.returnRequestType === ReturnRequestType.WITHDRAW
                ? returnRequest?.previousProcessingUserFullName
                : returnRequest?.currentProcessingUserFullName}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col span='4'>
              <Text strong>{`${t('return_request.return_request_receiver')}:`}</Text>
            </Col>
            <Col span='20'>
              {returnRequest?.returnRequestType === ReturnRequestType.WITHDRAW
                ? returnRequest?.currentProcessingUserFullName
                : returnRequest?.previousProcessingUserFullName}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col span='4'>
              <Typography.Text strong>{`${t('transfer_history.modal.document')}:`}</Typography.Text>
            </Col>
            <Col span='20'>{returnRequest?.documentId}</Col>
          </Row>
        </Col>
        <Col span={12}>
          <Row className='mb-3'>
            <Col span='4'>
              <Typography.Text strong>
                {`${t('transfer_history.modal.return_request_date')}:`}
              </Typography.Text>
            </Col>
            <Col span='20'>
              {/* {format(new Date(transferHistory?.createdDate), DAY_MONTH_YEAR_FORMAT_2)} */}
              {returnRequest?.createdAt}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col span='4'>
              <Typography.Text strong>
                {`${t('return_request.return_request_type')}:`}
              </Typography.Text>
            </Col>
            <Col span='20'>
              {returnRequest?.returnRequestType === ReturnRequestType.WITHDRAW
                ? t('return_request.withdraw_type')
                : t('return_request.send_back_type')}
            </Col>
          </Row>
          <Row className='mb-3'>
            <Col span='4'>
              <Typography.Text strong>
                {returnRequest?.returnRequestType === ReturnRequestType.WITHDRAW
                  ? `${t('transfer_history.withdraw.modal.reason')}:`
                  : `${t('transfer_history.send_back.modal.reason')}:`}
              </Typography.Text>
            </Col>
            <Col span='20'>{returnRequest?.reason}</Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const renderWithdrawPanel = (returnRequest: ReturnRequestGetDto) => {
    return (
      <Panel
        header={t('return_request.withdraw_message', {
          sender:
            returnRequest.previousProcessingUserId === currentUser?.id
              ? t('transfer_history.default_sender')
              : returnRequest.previousProcessingUserFullName,
          documentId: docId,
        })}
        key={returnRequest.id}>
        {renderPanelContent(returnRequest)}
      </Panel>
    );
  };

  const renderSendbackPanel = (returnRequest: ReturnRequestGetDto) => {
    return (
      <Panel
        header={t('return_request.send_back_message', {
          sender:
            returnRequest.currentProcessingUserId === currentUser?.id
              ? t('transfer_history.default_sender')
              : returnRequest.currentProcessingUserFullName,
          receiver:
            returnRequest.previousProcessingUserId === currentUser?.id
              ? t('transfer_history.default_receiver')
              : returnRequest.previousProcessingUserFullName,
          documentId: docId,
        })}
        key={returnRequest.id}>
        {renderPanelContent(returnRequest)}
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
