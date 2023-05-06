import React from 'react';
import { useTranslation } from 'react-i18next';
import { FilterFilled } from '@ant-design/icons';
import { Button, Col, Collapse, Form, Input, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { PRIMARY_COLOR } from 'config/constant';
import { t } from 'i18next';
import { DocSystemRoleEnum, UserSearchCriteria } from 'models/doc-main-models';
import { ALL_SYSTEM_ROLES } from 'models/models';
import { useSelectionDepartmentRes } from 'shared/hooks/DepartmentQuery';
import { useUserReq } from 'shared/hooks/UserQuery';

const { Panel } = Collapse;
const { TextArea } = Input;

const ExpandIcon = () => {
  return <FilterFilled style={{ color: PRIMARY_COLOR }} />;
};

const UserSearchForm = () => {
  const { t } = useTranslation();
  const { data: departments } = useSelectionDepartmentRes();
  const [form] = useForm();
  const [userReqQuery, setUserReqQuery] = useUserReq();

  return (
    <Collapse bordered={false} expandIcon={ExpandIcon}>
      <Panel header={t('common.search_criteria.title')} key='1'>
        <Form
          form={form}
          onFinish={(values: UserSearchCriteria) => {
            setUserReqQuery({
              ...userReqQuery,
              userSearchCriteria: {
                ...values,
              },
              page: 1,
            });
          }}
          layout='vertical'>
          <Row justify='space-between' className='flex justify-center'>
            <Col className='ml-6' span={18}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    name='username'
                    label={t('search_criteria_bar.user_management.username')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    name='email'
                    label={t('search_criteria_bar.user_management.email')}
                    rules={[
                      {
                        message: `${t('user.detail.email_invalid')}`,
                        type: 'email',
                      },
                    ]}>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    name='fullName'
                    label={t('search_criteria_bar.user_management.full_name')}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item name='role' label={t('search_criteria_bar.user_management.role')}>
                    <Select allowClear>
                      {ALL_SYSTEM_ROLES.map((role: DocSystemRoleEnum) => (
                        <Select.Option key={role} value={role}>
                          {t(`user.role.${role}`)}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    name='departmentId'
                    label={t('search_criteria_bar.user_management.department')}>
                    <Select allowClear>
                      {departments?.map((department) => (
                        <Select.Option key={department.id} value={department.id}>
                          {department.departmentName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row justify='end'>
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
            </Col>
          </Row>
        </Form>
      </Panel>
    </Collapse>
  );
};

export default UserSearchForm;
