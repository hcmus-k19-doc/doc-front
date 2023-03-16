import { useTranslation } from 'react-i18next';
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

import './index.css';

function ProcessIncomingDocPage() {
  const { t } = useTranslation();
  const { TextArea } = Input;

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('procesIncomingDocPage.title')}</div>
      <Form layout='vertical'>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.docFolder')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.docType')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.docNumber')}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.originalSymbolNumber')}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.distributionOrg')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.folder')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.distributionDate')}>
                  <DatePicker className='w-full' />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={6}>
                <Form.Item label={t('procesIncomingDocPage.form.arrivingDate')}>
                  <DatePicker className='w-full' />
                </Form.Item>
              </Col>

              <Col span={1}></Col>

              <Col span={4}>
                <Form.Item label={t('procesIncomingDocPage.form.arrivingTime')}>
                  <TimePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.signer')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.signerTitle')}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.urgency')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item label={t('procesIncomingDocPage.form.confidentiality')}>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>{' '}
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t('procesIncomingDocPage.form.summary')}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Form.Item label={t('procesIncomingDocPage.form.files')} valuePropName='fileList'>
              <Dragger {...props}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('procesIncomingDocPage.form.fileHelper')}</p>
              </Dragger>
            </Form.Item>
          </Col>

          <Row className='w-full justify-end '>
            <Button type='primary' size='large' className='mr-5'>
              {t('procesIncomingDocPage.form.button.save')}
            </Button>
            <Button type='primary' size='large' className='mr-5'>
              {t('procesIncomingDocPage.form.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
}

export default ProcessIncomingDocPage;
