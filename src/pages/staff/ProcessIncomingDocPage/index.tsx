import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
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
import incomingDocumentService from 'services/IncomingDocumentService';
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

  // const createIncomingDocument = useMutation({
  //   mutationFn: (incomingDocument: IncomingDocumentDto) => {
  //     console.log(incomingDocument);
  //     return incomingDocumentService.createIncomingDocument(incomingDocument);
  //   },
  // });

  const onFinish = async (values: any) => {
    console.log(values);

    // const incomingDocument: IncomingDocumentDto = {
    //   ...values,
    //   documentType: {
    //     id: 1,
    //   },
    //   distributionDate: new Date(),
    //   arrivingDate: new Date(),
    //   arrivingTime: values.arrivingTime.format('HH:mm:ss'),
    //   distributionOrg: {
    //     id: 1,
    //   },
    //   folder: 'Test',
    //   urgency: Urgency.LOW,
    //   confidentiality: Confidentiality.LOW,
    //   sendingLevel: {
    //     id: 1,
    //   },
    // };

    // createIncomingDocument.mutate(incomingDocument);

    // if (createIncomingDocument.isSuccess) {
    //   Swal.fire({
    //     icon: 'success',
    //     html: t('procesIncomingDocPage.form.message.success') as string,
    //     showConfirmButton: false,
    //     timer: 2000,
    //   }).then(() => {
    //     navigate('/index/docin');
    //   });
    // } else if (createIncomingDocument.isError) {
    //   Swal.fire({
    //     icon: 'error',
    //     html: t('procesIncomingDocPage.form.message.error') as string,
    //     showConfirmButton: false,
    //     timer: 2000,
    //   });
    // }
  };

  const onCancel = () => {
    navigate('/index/docin');
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('procesIncomingDocPage.title')}</div>
      <Form
        layout='vertical'
        onFinish={onFinish}
        initialValues={{
          incomingNumber: '123456789',
        }}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.docFolder')}
                  name='folder'
                  required
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t('procesIncomingDocPage.form.docFolderRequired') as string,
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
                  label={t('procesIncomingDocPage.form.documentType')}
                  name='documentType'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.documentTypeRequired') as string,
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
                  label={t('procesIncomingDocPage.form.incomingNumber')}
                  name='incomingNumber'>
                  <Input disabled />
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

            {/* <Row>
              <Col span={11}>
                <Form.Item
                  label={t('procesIncomingDocPage.form.signer')}
                  name='signer'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('procesIncomingDocPage.form.signerRequired') as string,
                    },
                  ]}
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
            </Row> */}

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
              type='default'
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
