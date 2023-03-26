import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
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
import dayjs from 'dayjs';
import {
  Confidentiality,
  DistributionOrganizationDto,
  DocumentTypeDto,
  FolderDto,
  IncomingDocumentDto,
  Urgency,
} from 'models/doc-main-models';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useIncomingDocumentDetailQuery } from 'shared/hooks/IncomingDocumentDetailQuery';
import DateValidator from 'shared/validators/DateValidator';
import Swal from 'sweetalert2';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';
import { HH_MM_SS_FORMAT } from 'utils/DateTimeUtils';
import { constructIncomingNumber } from 'utils/IncomingNumberUtils';

import './index.css';

function IncomingDocPage() {
  const { TextArea } = Input;
  const { docId } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();

  const navigate = useNavigate();

  const data = {
    role: 355,
  };

  const [buttonDisplayArr, setButtonDisplayArr] = useState<boolean[]>(Array(10).fill(false));

  const buttonArr: JSX.Element[] = [
    <Button type='primary' key='1' size='large' name='collect'>
      {t('incomingDocDetailPage.button.collect')}
    </Button>,
    <Button type='primary' key='2' size='large' name='edit'>
      {t('incomingDocDetailPage.button.edit')}
    </Button>,
    <Button type='primary' key='3' size='large' name='process'>
      {t('incomingDocDetailPage.button.process')}
    </Button>,
    <Button type='primary' size='large' key='4' name='transfer'>
      {t('incomingDocDetailPage.button.transfer')}
    </Button>,
    <Button type='primary' size='large' key='5' name='assign'>
      {t('incomingDocDetailPage.button.assign')}
    </Button>,
    <Button type='primary' size='large' key='6' name='comment'>
      {t('incomingDocDetailPage.button.comment')}
    </Button>,
    <Button type='primary' size='large' key='7' name='confirm'>
      {t('incomingDocDetailPage.button.confirm')}
    </Button>,
    <Button type='primary' size='large' key='9' name='return'>
      {t('incomingDocDetailPage.button.return')}
    </Button>,
    <Button type='primary' size='large' key='10' name='extend'>
      {t('incomingDocDetailPage.button.extend')}
    </Button>,
  ];

  // 2^9 - 1 = 511 (9 cái nút)

  // 0 thu thập
  // 0 chỉnh sửa
  // 0 soạn vb bc
  // 0 chuyển xử lý
  // 0 phân công
  // 0 góp ý văn bản
  // 0 xác nhận đã xem
  // 0 trả lại
  // 0 yêu cầu gia hạn

  // Ví dụ các nút ứng với quyền của chuyên viên xử lý chính
  // 101100011 (theo chiều từ trên xún) --> 355 --> role = 355

  const resolveDisplayButton = (roleNum: number) => {
    const arr = [];
    for (let i = 0; i < 9; i++) {
      if ((roleNum >> (8 - i)) & 1) {
        arr.push(true);
      } else {
        arr.push(false);
      }
    }

    setButtonDisplayArr(arr);
  };

  const renderButton = () => {
    return buttonDisplayArr.map((item, index) => {
      if (item) {
        return (
          <>
            {buttonArr[index]}
            {index === buttonDisplayArr.length - 1 ? null : <span className='mr-5'></span>}
          </>
        );
      }
    });
  };

  const [foldersQuery, documentTypesQuery, distributionOrgsQuery] = useDropDownFieldsQuery();
  const incomingDocumentQuery = useIncomingDocumentDetailQuery(+(docId || 1));

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
    if (incomingDocumentQuery.data?.folder?.id === value) {
      form.setFieldValue('incomingNumber', incomingDocumentQuery.data?.incomingNumber);
      return;
    }

    const folder: FolderDto =
      foldersQuery.data?.find((folder: FolderDto) => folder.id === value) || ({} as FolderDto);

    form.setFieldValue('incomingNumber', constructIncomingNumber(folder));
  };

  useEffect(() => {
    const incomingDocument = incomingDocumentQuery.data || ({} as IncomingDocumentDto);

    form.setFieldsValue({
      folder: incomingDocument.folder?.id,
      incomingNumber: incomingDocument.incomingNumber,
      documentType: incomingDocument.documentType?.id,
      distributionOrg: incomingDocument.distributionOrg?.id,
      urgency: incomingDocument.urgency,
      confidentiality: incomingDocument.confidentiality,
      originalSymbolNumber: incomingDocument.originalSymbolNumber,
      distributionDate: dayjs(incomingDocument.distributionDate),
      arrivingDate: dayjs(incomingDocument.arrivingDate),
      arrivingTime: dayjs(incomingDocument.arrivingTime, HH_MM_SS_FORMAT),
      summary: incomingDocument.summary,
    });
  });

  useEffect(() => {
    resolveDisplayButton(data.role);
  }, []);

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
        message.success(`${info.file.name} ${t('incomingDocDetailPage.form.message.fileSuccess')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('incomingDocDetailPage.form.message.fileError')}`);
      }
    },
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    Swal.fire({
      icon: 'success',
      html: t('incomingDocDetailPage.form.message.success') as string,
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      navigate('/index/docin');
    });
  };

  return (
    <div>
      <div className='text-lg text-primary'>{t('incomingDocDetailPage.title')}</div>
      <Form form={form} layout='vertical' onFinish={onFinish}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.docFolder')}
                  name='folder'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.docFolderRequired') as string,
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
                  label={t('incomingDocDetailPage.form.documentType')}
                  name='documentType'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.documentTypeRequired') as string,
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
                  label={t('incomingDocDetailPage.form.incomingNumber')}
                  name='incomingNumber'>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.originalSymbolNumber')}
                  required
                  name='originalSymbolNumber'
                  rules={[
                    {
                      required: true,
                      message: t(
                        'incomingDocDetailPage.form.originalSymbolNumberRequired'
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
                  label={t('incomingDocDetailPage.form.distributionOrg')}
                  name='distributionOrg'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.distributionOrgRequired') as string,
                    },
                  ]}>
                  <Select>{renderDistributionOrg()}</Select>
                </Form.Item>
              </Col>
              <Col span={2}></Col>
              <Col span={11}>
                {/* <Form.Item label={t('incomingDocDetailPage.form.folder')} name='workFolder'>
                  <Select>
                    <Select.Option value='demo'>Demo</Select.Option>
                  </Select>
                </Form.Item> */}
                <Form.Item
                  label={t('incomingDocDetailPage.form.distributionDate')}
                  name='distributionDate'
                  required
                  rules={[
                    {
                      message: t(
                        'incomingDocDetailPage.form.distributionDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('incomingDocDetailPage.form.distributionDateInvalid') as string,
                      validator: (_, value) => {
                        const arrivingDate = form.getFieldValue('arrivingDate');
                        return DateValidator.validateBeforeAfter(value, arrivingDate);
                      },
                    },
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.distributionDateRequired') as string,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.arrivingDate')}
                  name='arrivingDate'
                  required
                  rules={[
                    {
                      message: t(
                        'incomingDocDetailPage.form.arrivingDateGreaterThanNowError'
                      ) as string,
                      validator: (_, value) => {
                        const now = new Date();
                        return DateValidator.validateBeforeAfter(value, now);
                      },
                    },
                    {
                      message: t('incomingDocDetailPage.form.arrivingDateInvalid') as string,
                      validator: (_, value) => {
                        const distributionDate = form.getFieldValue('distributionDate');
                        return DateValidator.validateBeforeAfter(distributionDate, value);
                      },
                    },
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.arrivingDateRequired') as string,
                    },
                  ]}>
                  <DatePicker format={DAY_MONTH_YEAR_FORMAT} className='w-full' />
                </Form.Item>
              </Col>

              <Col span={2}></Col>

              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.arrivingTime')}
                  name='arrivingTime'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.arrivingTimeRequired') as string,
                    },
                  ]}>
                  <TimePicker className='w-full' />
                </Form.Item>
              </Col>
            </Row>

            {/* <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.signer')}
                  name='signer'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.signerRequired') as string,
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
                  label={t('incomingDocDetailPage.form.signerTitle')}
                  name='signerTitle'
                  // required
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: t('incomingDocDetailPage.form.signerTitleRequired') as string,
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
                  label={t('incomingDocDetailPage.form.urgency')}
                  name='urgency'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.urgencyRequired') as string,
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
                  label={t('incomingDocDetailPage.form.confidentiality')}
                  name='confidentiality'
                  required
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.confidentialityRequired') as string,
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
              label={t('incomingDocDetailPage.form.summary')}
              name='summary'
              required
              rules={[
                {
                  required: true,
                  message: t('incomingDocDetailPage.form.summaryRequired') as string,
                },
              ]}>
              <TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={1}></Col>
          <Col span={7}>
            <Form.Item
              label={t('incomingDocDetailPage.form.files')}
              name='files'
              required
              rules={[
                {
                  required: true,
                  message: t('incomingDocDetailPage.form.filesRequired') as string,
                },
              ]}>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('incomingDocDetailPage.form.fileHelper')}</p>
              </Dragger>
            </Form.Item>
          </Col>

          <Row className='w-full justify-end '>{renderButton()}</Row>
        </Row>
      </Form>
    </div>
  );
}

export default IncomingDocPage;
