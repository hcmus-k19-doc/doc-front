import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Input, Row, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useForm } from 'antd/es/form/Form';
import { SearchCriteriaProps } from 'components/TransferDocModal/core/models';
import { PRIMARY_COLOR } from 'config/constant';
import { ProcessingStatus } from 'models/doc-main-models';
import { useDistributionOrgRes } from 'shared/hooks/DistributionOrgsQuery';
import { useDocumentTypesRes } from 'shared/hooks/DocumentTypesQuery';
import { useIncomingDocReq } from 'shared/hooks/IncomingDocumentListQuery';
import { SearchState } from 'shared/hooks/IncomingDocumentListQuery/core/states';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

const { Panel } = Collapse;
const { TextArea } = Input;

const ExpandIcon = () => {
  return <FilterFilled style={{ color: PRIMARY_COLOR }} />;
};

const IncomingDocumentSearchForm: React.FC<SearchCriteriaProps> = ({ isLoading }) => {
  const { t } = useTranslation();
  const { data: documentTypes } = useDocumentTypesRes();
  const { distributionOrgs } = useDistributionOrgRes();
  const [form] = useForm();
  const [incomingDocReqQuery, setIncomingDocReqQuery] = useIncomingDocReq();

  return (
    <Collapse bordered={false} expandIcon={ExpandIcon}>
      <Panel header={t('common.search_criteria.title')} key='1'>
        <Form
          form={form}
          onFinish={(values: SearchState) => {
            setIncomingDocReqQuery({ ...incomingDocReqQuery, ...values, page: 1 });
          }}
          layout='vertical'>
          <Row justify='space-between'>
            <Col className='ml-6' span={24}>
              <Row>
                <Col span={7}>
                  <Form.Item name='incomingNumber' label={t('search_criteria_bar.incoming_number')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    name='originalSymbolNumber'
                    label={t('search_criteria_bar.original_symbol_number')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item name='documentTypeId' label={t('search_criteria_bar.document_type')}>
                    <Select>
                      {documentTypes?.map((documentType: any) => (
                        <Select.Option key={documentType.id} value={documentType.id}>
                          {documentType.type}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item
                    name='distributionOrgId'
                    label={t('search_criteria_bar.distribution_organization')}>
                    <Select>
                      {distributionOrgs?.map((distributionOrg) => (
                        <Select.Option key={distributionOrg.id} value={distributionOrg.id}>
                          {distributionOrg.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item name='arrivingDate' label={t('search_criteria_bar.arriving_date')}>
                    <DatePicker.RangePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      locale={locale}
                      className='flex flex-grow'
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item
                    name='processingDuration'
                    label={t('search_criteria_bar.processing_duration')}>
                    <DatePicker.RangePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      locale={locale}
                      className='flex flex-grow'
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={7}>
                  <Form.Item name='status' label={t('search_criteria_bar.status')}>
                    <Select>
                      {[
                        ProcessingStatus.UNPROCESSED,
                        ProcessingStatus.IN_PROGRESS,
                        ProcessingStatus.CLOSED,
                      ].map((status) => (
                        <Select.Option key={status} value={status}>
                          {t(`PROCESSING_STATUS.${status}`)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
              </Row>
              <Row>
                <Col span={23}>
                  <Form.Item name='summary' label={t('search_criteria_bar.summary')}>
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
              <Button className='px-8 mr-5' htmlType='submit' type='primary' loading={isLoading}>
                {t('common.search_criteria.search')}
              </Button>
              <Button
                onClick={() => form.resetFields()}
                htmlType='submit'
                type='default'
                loading={isLoading}
                className='px-8 reset-btn'>
                {t('common.search_criteria.reset')}
              </Button>
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default IncomingDocumentSearchForm;
