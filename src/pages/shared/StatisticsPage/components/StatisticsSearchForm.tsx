import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Row, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useForm } from 'antd/es/form/Form';
import { PRIMARY_COLOR } from 'config/constant';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import { useStatisticsReq } from '../../../../shared/hooks/StatisticsQuery';
import { docTypesOptions, SearchState } from '../../../../shared/hooks/StatisticsQuery/core/states';

const { Panel } = Collapse;

const ExpandIcon = () => {
  return <FilterFilled style={{ color: PRIMARY_COLOR }} />;
};

const StatisticsSearchForm = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [statisticsReqQuery, setstatisticsReqQuery] = useStatisticsReq();

  return (
    <Collapse bordered={false} expandIcon={ExpandIcon}>
      <Panel header={t('common.search_criteria.report')} key='1'>
        <Form
          form={form}
          onFinish={(values: SearchState) => {
            setstatisticsReqQuery({ ...statisticsReqQuery, ...values, page: 1 });
            console.log(values);
          }}
          layout='vertical'>
          <Row justify='space-between'>
            <Col className='ml-6' span={24}>
              <Row>
                <Col span={7}>
                  <Form.Item
                    initialValue={docTypesOptions?.[0].value}
                    name='docTypes'
                    label={t('search_criteria_bar.doc_types')}>
                    <Select
                      defaultValue={docTypesOptions?.[0].value}
                      allowClear
                      options={docTypesOptions}
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item name='fromDate' label={t('search_criteria_bar.from_date')}>
                    <DatePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      locale={locale}
                      className='flex flex-grow'
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
                <Col span={7}>
                  <Form.Item name='toDate' label={t('search_criteria_bar.to_date')}>
                    <DatePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      locale={locale}
                      className='flex flex-grow'
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button className='px-8 mr-5' htmlType='submit' type='primary'>
                {t('common.search_criteria.export')}
              </Button>
              <Button
                onClick={() => form.resetFields()}
                htmlType='submit'
                type='default'
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

export default StatisticsSearchForm;
