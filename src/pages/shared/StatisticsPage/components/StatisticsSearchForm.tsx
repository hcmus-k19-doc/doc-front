import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import { Button, Col, Collapse, DatePicker, Form, Row, Select } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { useForm } from 'antd/es/form/Form';
import { PRIMARY_COLOR } from 'config/constant';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

import { useAuth } from '../../../../components/AuthComponent';
import { useStatisticsReq } from '../../../../shared/hooks/StatisticsQuery';
import { docTypeOptions, SearchState } from '../../../../shared/hooks/StatisticsQuery/core/states';
import DocFormValidators from '../../../../shared/validators/DocFormValidators';

const { Panel } = Collapse;

const ExpandIcon = () => {
  return <FilterFilled style={{ color: PRIMARY_COLOR }} />;
};

const StatisticsSearchForm = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [statisticsReqQuery, setStatisticsReqQuery] = useStatisticsReq();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Collapse bordered={false} expandIcon={ExpandIcon}>
      <Panel header={t('common.search_criteria.report')} key='1'>
        <Form
          form={form}
          onFinish={(values: SearchState) => {
            setLoading(true);
            setStatisticsReqQuery({ ...statisticsReqQuery, ...values, page: 1 });
            setLoading(false);
          }}
          layout='vertical'>
          <Row justify='space-between'>
            <Col className='ml-6' span={24}>
              <Row>
                <Form.Item initialValue={[currentUser?.id]} name='expertIds' hidden={true}>
                  <Select mode='multiple' style={{ width: '100%' }} allowClear />
                </Form.Item>
                <Col span={10}>
                  <Form.Item
                    initialValue={docTypeOptions?.[0].value}
                    name='docType'
                    label={t('search_criteria_bar.doc_types')}
                    rules={[
                      DocFormValidators.NoneChoiceValidator(t('statistics.form.docTypeRequired')),
                    ]}
                    required>
                    <Select allowClear options={docTypeOptions} />
                  </Form.Item>
                </Col>
                <Col span={3}></Col>
                <Col span={10}>
                  <Form.Item name='statisticDate' label={t('search_criteria_bar.statistic_date')}>
                    <DatePicker.RangePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      locale={locale}
                      className='flex flex-grow'
                    />
                  </Form.Item>
                </Col>
                <Col span={1}></Col>
              </Row>
              <Button className='px-8 mr-5' htmlType='submit' type='primary' loading={loading}>
                {t('common.search_criteria.export')}
              </Button>
              <Button
                onClick={() => form.resetFields()}
                htmlType='submit'
                type='default'
                loading={loading}
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
