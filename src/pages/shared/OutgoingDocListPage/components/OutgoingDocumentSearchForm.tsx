import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Input, Row, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useForm } from 'antd/es/form/Form';
import { PRIMARY_COLOR } from 'config/constant';
import { useDocumentTypesRes } from 'shared/hooks/DocumentTypesQuery';
import { useOutgoingDocReq } from 'shared/hooks/OutgoingDocumentListQuery';
import { OutgoingDocSearchState } from 'shared/hooks/OutgoingDocumentListQuery/core/states';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

const { Panel } = Collapse;
const { TextArea } = Input;

const ExpandIcon = () => {
  return <FilterFilled style={{ color: PRIMARY_COLOR }} />;
};

const OutgoingDocumentSearchForm = () => {
  const { t } = useTranslation();
  const { data: documentTypes } = useDocumentTypesRes();
  const [form] = useForm();
  const [outgoingDocReqQuery, setOutgoingDocReqQuery] = useOutgoingDocReq();

  return (
    <Collapse bordered={false} expandIcon={ExpandIcon}>
      <Panel header={t('common.search_criteria.title')} key='1'>
        <Form
          form={form}
          onFinish={(values: OutgoingDocSearchState) => {
            setOutgoingDocReqQuery({ ...outgoingDocReqQuery, ...values, page: 1 });
          }}
          layout='vertical'>
          <Row justify='space-between'>
            <Col className='ml-6' span={23}>
              <Row>
                <Col span={4}>
                  <Form.Item name='outgoingNumber' label={t('search_criteria_bar.outgoing_number')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={4}>
                  <Form.Item
                    name='originalSymbolNumber'
                    label={t('search_criteria_bar.original_symbol_number')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={6}>
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
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item name='releaseDate' label={t('search_criteria_bar.release_date')}>
                    <DatePicker.RangePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      locale={locale}
                      className='flex flex-grow'
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item name='summary' label={t('search_criteria_bar.summary')}>
                    <TextArea rows={4} />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Row>
              <Button className='px-8 mx-5' htmlType='submit' type='primary'>
                {t('common.search_criteria.search')}
              </Button>
              <Button
                onClick={() => form.resetFields()}
                htmlType='submit'
                type='default'
                className='px-8 reset-btn'>
                {t('common.search_criteria.reset')}
              </Button>
            </Row>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default OutgoingDocumentSearchForm;
