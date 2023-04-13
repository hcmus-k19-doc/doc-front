import { useEffect } from 'react';
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
import { useForm } from 'antd/es/form/Form';
import Dragger from 'antd/es/upload/Dragger';
import { PRIMARY_COLOR } from 'config/constant';
import {
  Confidentiality,
  DistributionOrganizationDto,
  DocumentTypeDto,
  FolderDto,
  IncomingDocumentPostDto,
  Urgency,
} from 'models/doc-main-models';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import DateValidator from 'shared/validators/DateValidator';
import Swal from 'sweetalert2';
import { DAY_MONTH_YEAR_FORMAT, HH_MM_SS_FORMAT } from 'utils/DateTimeUtils';
import { constructIncomingNumber } from 'utils/IncomingNumberUtils';

import './index.css';

function ProcessIncomingDocPage() {
  const { t } = useTranslation();
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [form] = useForm();

  const [foldersQuery, documentTypesQuery, distributionOrgsQuery] = useDropDownFieldsQuery();

  const renderFolders = () => {
    return foldersQuery.data?.map((folder: FolderDto) => (
      <Select.Option key={folder.id} value={folder.id}>
        {folder.folderName}
      </Select.Option>
    ));
  };

  const renderDistributionOrg = () => {
    return distributionOrgsQuery.data?.map((org: DistributionOrganizationDto) => (
      <Select.Option key={org.id} value={org.id}>
        {org.name}
      </Select.Option>
    ));
  };

  const renderDocumentTypes = () => {
    return documentTypesQuery.data?.map((docType: DocumentTypeDto) => (
      <Select.Option key={docType.id} value={docType.id}>
        {docType.type}
      </Select.Option>
    ));
  };

  const handleFolderChange = (value: any) => {
    const folder: FolderDto =
      foldersQuery.data?.find((folder: FolderDto) => folder.id === value) || ({} as FolderDto);
    form.setFieldValue('incomingNumber', constructIncomingNumber(folder));
  };

  useEffect(() => {
    form.setFieldsValue({
      folder: foldersQuery.data?.[0].id,
      incomingNumber: constructIncomingNumber(foldersQuery.data?.[0] || ({} as FolderDto)),
      documentType: documentTypesQuery.data?.[0].id,
      distributionOrg: distributionOrgsQuery.data?.[0].id,
      urgency: Urgency.HIGH,
      confidentiality: Confidentiality.HIGH,
    });
  });

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
        message.success(`${info.file.name} ${t('processIncomingDocPage.message.fileSuccess')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('processIncomingDocPage.message.fileError')}`);
      }
    },
  };

  const onFinish = async (values: any) => {
    try {
      delete values.files;

      const incomingDocument: IncomingDocumentPostDto = {
        ...values,
        distributionDate: new Date(values.distributionDate),
        arrivingDate: new Date(values.arrivingDate),
        arrivingTime: values.arrivingTime?.format(HH_MM_SS_FORMAT),
      };

      const response = await incomingDocumentService.createIncomingDocument(incomingDocument);

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          html: t('processIncomingDocPage.message.success') as string,
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          navigate('/index/docin');
        });
      }
    } catch (error) {
      //Only in this case, deal to the UX, just show a popup instead of navigating to error page
      Swal.fire({
        icon: 'error',
        html: t('processIncomingDocPage.message.error') as string,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const onCancel = () => {
    navigate('/index/docin');
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('processIncomingDocPage.title')}</div>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.docFolder')}
                  name='folder'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.docFolderRequired') as string,
                    },
                  ]}>
                  <Select onChange={(value: number) => handleFolderChange(value)}>
                    {renderFolders()}{' '}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.documentType')}
                  name='documentType'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.documentTypeRequired') as string,
                    },
                  ]}>
                  <Select>{renderDocumentTypes()}</Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  required
                  label={t('processIncomingDocPage.form.incomingNumber')}
                  name='incomingNumber'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.originalSymbolNumber')}
                  required
                  name='originalSymbolNumber'
                  rules={[
                    {
                      required: true,
                      message: t(
                        'processIncomingDocPage.form.originalSymbolNumberRequired'
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
                  label={t('processIncomingDocPage.form.distributionOrg')}
                  name='distributionOrg'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.distributionOrgRequired') as string,
                    },
                  ]}>
                  <Select>{renderDistributionOrg()}</Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.distributionDate')}
                  name='distributionDate'
                  required
                  rules={[
                    {
                      message: t(
                        'processIncomingDocPage.form.distributionDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('processIncomingDocPage.form.distributionDateInvalid') as string,
                      validator: (_, value) => {
                        const arrivingDate = form.getFieldValue('arrivingDate');
                        return DateValidator.validateBeforeAfter(value, arrivingDate);
                      },
                    },
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.distributionDateRequired') as string,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.arrivingDate')}
                  name='arrivingDate'
                  required
                  rules={[
                    {
                      message: t(
                        'processIncomingDocPage.form.arrivingDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('processIncomingDocPage.form.arrivingDateInvalid') as string,
                      validator: (_, value) => {
                        const distributionDate = form.getFieldValue('distributionDate');
                        return DateValidator.validateBeforeAfter(distributionDate, value);
                      },
                    },
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.arrivingDateRequired') as string,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.arrivingTime')}
                  name='arrivingTime'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.arrivingTimeRequired') as string,
                    },
                  ]}>
                  <TimePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.signer')}
                  name='signer'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.signerRequired') as string,
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
                  label={t('processIncomingDocPage.form.signerTitle')}
                  name='signerTitle'
                  // required
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t('processIncomingDocPage.form.signerTitleRequired') as string,
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
                  label={t('processIncomingDocPage.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.urgencyRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value={Urgency.HIGH}>Cao</Select.Option>
                    <Select.Option value={Urgency.MEDIUM}>Trung bình</Select.Option>
                    <Select.Option value={Urgency.LOW}>Thấp</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('processIncomingDocPage.form.confidentiality')}
                  name='confidentiality'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('processIncomingDocPage.form.confidentialityRequired') as string,
                    },
                  ]}>
                  <Select>
                    <Select.Option value={Confidentiality.HIGH}>Cao</Select.Option>
                    <Select.Option value={Confidentiality.MEDIUM}>Trung bình</Select.Option>
                    <Select.Option value={Confidentiality.LOW}>Thấp</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label={t('processIncomingDocPage.form.summary')}
              name='summary'
              required
              rules={[
                {
                  required: true,
                  message: t('processIncomingDocPage.form.summaryRequired') as string,
                },
              ]}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Form.Item
              label={t('processIncomingDocPage.form.files')}
              name='files'
              required
              rules={[
                {
                  required: true,
                  message: t('processIncomingDocPage.form.filesRequired') as string,
                },
              ]}>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('processIncomingDocPage.form.fileHelper')}</p>
              </Dragger>
            </Form.Item>
          </Col>

          <Row className='w-full justify-end '>
            <Button type='primary' size='large' htmlType='submit' className='mr-5'>
              {t('processIncomingDocPage.form.button.save')}
            </Button>
            <Button
              type='default'
              size='large'
              className='mr-5'
              onClick={() => {
                onCancel();
              }}>
              {t('processIncomingDocPage.form.button.cancel')}
            </Button>
          </Row>
        </Row>
      </Form>
    </div>
  );
}

export default ProcessIncomingDocPage;
