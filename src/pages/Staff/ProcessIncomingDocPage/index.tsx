import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
  UploadProps,
} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import Swal from 'sweetalert2';

import './index.css';

function ProcessIncomingDocPage() {
  const { t } = useTranslation();
  const { TextArea } = Input;
  const navigate = useNavigate();

  const dummyRequest = ({ onSuccess }: any) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const fileProps: UploadProps = {
    name: 'file',
    multiple: true,
    customRequest: dummyRequest,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} ${t('procesIncomingDocPage.form.message.fileSuccess')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('procesIncomingDocPage.form.message.fileError')}`);
      }
    },
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    Swal.fire({
      icon: 'success',
      html: t('procesIncomingDocPage.form.message.success') as string,
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      navigate('/index/docin');
    });
  };

  const onCancel = () => {
    navigate('/index/docin');
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('procesIncomingDocPage.title')}</div>
      <Form layout='vertical' onFinish={onFinish}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.docFolder')}
                  name='docFolder'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.docFolderRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.docType')}
                  name='docType'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.docTypeRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  required
                  label={t('procesIncomingDocPage.form.docNumber')}
                  name='docNumber'>
                  <Input disabled defaultValue={'1234567890'} />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.originalSymbolNumber')}
                  required
                  name='originalSymbolNumber'
                  rules={[
                    {
                      required: true,
                      message: t(
                        'procesIncomingDocPage.form.originalSymbolNumberRequired'
                      ) as string,
                    },
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.distributionOrg')}
                  name='distributionOrg'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.distributionOrgRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                {/* <Form.Item label={t('procesIncomingDocPage.form.folder')} name='workFolder'>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item> */}
                <Form.Item
                  label={t('procesIncomingDocPage.form.distributionDate')}
                  name='distributionDate'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.distributionDateRequired') as string,
                    },
                  ]}>
                  <DatePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.arrivingDate')}
                  name='arrivingDate'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.arrivingDateRequired') as string,
                    },
                  ]}>
                  <DatePicker className='w-full' />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.arrivingTime')}
                  name='arrivingTime'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.arrivingTimeRequired') as string,
                    },
                  ]}>
                  <TimePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.signer')}
                  name='signer'
                  // required
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t('procesIncomingDocPage.form.signerRequired') as string,
                  //   },
                  // ]}
                >
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.signerTitle')}
                  name='signerTitle'
                  // required
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t('procesIncomingDocPage.form.signerTitleRequired') as string,
                  //   },
                  // ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.urgencyRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.confidentiality')}
                  name='confidentiality'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.confidentialityRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t('procesIncomingDocPage.form.summary')}
              name='summary'
              required
              rules={[
                {
                  required: true,
                  message: t('procesIncomingDocPage.form.summaryRequired') as string,
                },
              ]}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Form.Item
              label={t('procesIncomingDocPage.form.files')}
              name='files'
              required
              rules={[
                {
                  required: true,
                  message: t('procesIncomingDocPage.form.filesRequired') as string,
                },
              ]}>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('procesIncomingDocPage.form.fileHelper')}</p>
              </Dragger>
            </Form.Item>
          </Col>

          <Row className='w-full justify-end '>
            <Button type='primary' size='large' htmlType='submit' className='mr-5'>
              {t('procesIncomingDocPage.form.button.save')}
            </Button>
            <Button
              type='primary'
              size='large'
              className='mr-5'
              onClick={() => {
                onCancel();
              }}>
              {t('procesIncomingDocPage.form.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
}

export default ProcessIncomingDocPage;