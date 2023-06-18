import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CloseCircleOutlined,
  InboxOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Col,
  DatePicker,
  Form,
  Input,
  List,
  message,
  Row,
  Select,
  Skeleton,
  TimePicker,
  UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import DocButtonList from 'components/DocButtonList';
import DocComment from 'components/DocComment';
import LinkDocumentModal from 'components/LinkDocumentModal';
import ProcessingStepComponent from 'components/ProcessingStepComponent';
import TransferDocModal from 'components/TransferDocModal';
import TransferDocModalDetail from 'components/TransferDocModal/components/TransferDocModalDetail';
import { PRIMARY_COLOR } from 'config/constant';
import dayjs from 'dayjs';
import {
  Confidentiality,
  DistributionOrganizationDto,
  DocumentTypeDto,
  FolderDto,
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  IncomingDocumentDto,
  IncomingDocumentPutDto,
  ProcessingDocumentRoleEnum,
  ProcessingDocumentTypeEnum,
  TransferDocDto,
  Urgency,
  UserDto,
} from 'models/doc-main-models';
import { RecoilRoot, useRecoilValue } from 'recoil';
import incomingDocumentService from 'services/IncomingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useIncomingDocumentDetailQuery } from 'shared/hooks/IncomingDocumentDetailQuery';
import { useDocInLinkedDocumentsQuery } from 'shared/hooks/LinkedDocumentsQuery/IncomingDocument';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import DateValidator from 'shared/validators/DateValidator';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';
import { DAY_MONTH_YEAR_FORMAT, HH_MM_SS_FORMAT } from 'utils/DateTimeUtils';
import { globalNavigate } from 'utils/RoutingUtils';
import { getStep } from 'utils/TransferDocUtils';

import { transferDocModalState } from '../IncomingDocListPage/core/states';

import './index.css';

function IncomingDocPage() {
  const { docId } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();

  const showAlert = useSweetAlert();

  const [isEditing, setIsEditing] = useState(false);

  const linkedDocuments = useDocInLinkedDocumentsQuery(+(docId || 1));
  const [foldersQuery, documentTypesQuery, distributionOrgsQuery] = useDropDownFieldsQuery();
  const { isLoading, data, isFetching } = useIncomingDocumentDetailQuery(+(docId || 1));
  const [selectedDocs, setSelectedDocs] = useState<IncomingDocumentDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const transferDocModalItem = useRecoilValue(transferDocModalState);
  const transferQuerySetter = useTransferQuerySetter();
  const navigate = useNavigate();

  const [openLinkDocumentModal, setOpenLinkDocumentModal] = useState(false);

  useEffect(() => {
    const incomingDocument = {
      ...data?.data,
      status: t(`PROCESSING_STATUS.${data?.data.status}`),
    };
    setSelectedDocs([incomingDocument as unknown as IncomingDocumentDto]);
  }, [data?.data]);

  // Transfer Doc Modal
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [, setError] = useState<string>();
  const [transferDocumentDetail, setTransferDocumentDetail] =
    useState<GetTransferDocumentDetailCustomResponse>();

  const handleOnOpenModal = async () => {
    setIsModalOpen(true);

    if (selectedDocs[0].isDocTransferred || selectedDocs[0].isDocCollaborator) {
      const getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest = {
        documentId: +(docId || 1),
        userId: currentUser?.id as number,
        role: ProcessingDocumentRoleEnum.REPORTER,
        step: getStep(currentUser as UserDto, null, true),
      };

      if (selectedDocs[0].isDocCollaborator) {
        getTransferDocumentDetailRequest.role = ProcessingDocumentRoleEnum.COLLABORATOR;
        getTransferDocumentDetailRequest.step = getStep(currentUser as UserDto, null, false);
      }

      setLoading(true);
      try {
        const response = await incomingDocumentService.getTransferDocumentDetail(
          getTransferDocumentDetailRequest
        );

        setTransferDocumentDetail(response);
      } catch (error) {
        showAlert({
          icon: 'error',
          html: t('incomingDocListPage.message.get_transfer_document_detail_error'),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOnCancelModal = () => {
    setIsModalOpen(false);
    modalForm.resetFields();
    transferQuerySetter(initialTransferQueryState);
  };

  const handleOnOkModal = async () => {
    const transferDocDto: TransferDocDto = {
      documentIds: selectedDocs.map((doc) => doc.id),
      summary: modalForm.getFieldValue('summary'),
      reporterId: currentUser?.id as number,
      assigneeId: modalForm.getFieldValue('assignee') as number,
      collaboratorIds: modalForm.getFieldValue('collaborators') as number[],
      processingTime: modalForm.getFieldValue('processingTime'),
      isInfiniteProcessingTime: modalForm.getFieldValue('isInfiniteProcessingTime'),
      processMethod: modalForm.getFieldValue('processMethod'),
      transferDocumentType: transferDocModalItem.transferDocumentType,
      isTransferToSameLevel: transferDocModalItem.isTransferToSameLevel,
    };

    if (
      await validateTransferDocs(
        selectedDocs,
        transferDocModalItem.transferDocumentType,
        transferDocDto,
        t,
        currentUser
      )
    ) {
      modalForm.submit();
      setIsSubmitLoading(true);
      transferQuerySetter(transferDocDto);
      try {
        const response = await incomingDocumentService.transferDocuments(transferDocDto);
        if (response.status === 200) {
          queryClient.invalidateQueries(['QUERIES.INCOMING_DOCUMENT_DETAIL', +(docId || 1)]);
          if (transferDocDto.isTransferToSameLevel) {
            navigate('/docin/in-list');
          }
          showAlert({
            icon: 'success',
            html: t('incomingDocListPage.message.transfer_success') as string,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.message);
          console.error(error.response?.data.message);
        } else {
          console.error(error);
        }
      }
    }
    setIsSubmitLoading(false);
    modalForm.resetFields();
    setIsModalOpen(false);
  };

  const handleOnCancelLinkModal = () => {
    setOpenLinkDocumentModal(false);
  };

  if (!isLoading) {
    if (data?.data) {
      const incomingDocument = data?.data;

      form.setFieldsValue({
        name: incomingDocument.name,
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
    } else {
      globalNavigate('error');
    }
  }

  const enableEditing = () => {
    setIsEditing(true);
  };

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
        message.success(`${info.file.name} ${t('incomingDocDetailPage.message.file_success')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('incomingDocDetailPage.message.file_error')}`);
      }
    },
  };

  const saveChange = async (values: any) => {
    delete values.files;

    const incomingDocument: IncomingDocumentPutDto = {
      ...values,
      id: +(docId || 0),
      distributionDate: new Date(values.distributionDate),
      arrivingDate: new Date(values.arrivingDate),
      arrivingTime: values.arrivingTime?.format(HH_MM_SS_FORMAT),
    };

    const response = await incomingDocumentService.updateIncomingDocument(incomingDocument);

    if (response.status === 200) {
      showAlert({
        icon: 'success',
        html: t('incomingDocDetailPage.message.success') as string,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const onFinishEditing = () => {
    form.submit();
  };

  return (
    <Skeleton loading={isLoading || isFetching || linkedDocuments.isLoading} active>
      <div className='text-lg text-primary'>{t('incomingDocDetailPage.title')}</div>
      <Form form={form} layout='vertical' onFinish={saveChange} disabled={!isEditing}>
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
                  <Select disabled>{renderFolders()}</Select>
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
                  label={
                    <>
                      <div className='mr-2'>
                        {t('incomingDocDetailPage.form.originalSymbolNumber')}
                      </div>
                      <a
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://thuvienphapluat.vn/chinh-sach-phap-luat-moi/vn/thoi-su-phap-luat/tu-van-phap-luat/30698/cach-ghi-so-hieu-van-ban-hanh-chinh-dung-chuan-phap-luat'>
                        <QuestionCircleOutlined
                          style={{ color: PRIMARY_COLOR }}
                          className='help-icon'
                        />
                      </a>
                    </>
                  }
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
                    <Select.Option value={Urgency.HIGH}>
                      {t(`incomingDocDetailPage.form.select.option.${Urgency.HIGH}`)}
                    </Select.Option>
                    <Select.Option value={Urgency.MEDIUM}>
                      {t(`incomingDocDetailPage.form.select.option.${Urgency.MEDIUM}`)}
                    </Select.Option>
                    <Select.Option value={Urgency.LOW}>
                      {t(`incomingDocDetailPage.form.select.option.${Urgency.LOW}`)}
                    </Select.Option>
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
                    <Select.Option value={Confidentiality.HIGH}>
                      {t(`incomingDocDetailPage.form.select.option.${Confidentiality.HIGH}`)}
                    </Select.Option>
                    <Select.Option value={Confidentiality.MEDIUM}>
                      {t(`incomingDocDetailPage.form.select.option.${Confidentiality.MEDIUM}`)}
                    </Select.Option>
                    <Select.Option value={Confidentiality.LOW}>
                      {t(`incomingDocDetailPage.form.select.option.${Confidentiality.LOW}`)}
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={11}>
                <Form.Item
                  label={t('incomingDocDetailPage.form.name')}
                  required
                  name='name'
                  rules={[
                    {
                      required: true,
                      message: t('incomingDocDetailPage.form.name_required') as string,
                    },
                  ]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t('incomingDocDetailPage.form.summary')} name='summary'>
              <CKEditor
                disabled={!isEditing}
                editor={ClassicEditor}
                data={form.getFieldValue('summary')}
                onChange={(event, editor) => {
                  form.setFieldValue('summary', editor.getData());
                }}
              />
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
                  message: t('incomingDocDetailPage.form.files_required') as string,
                },
              ]}>
              <Dragger {...fileProps}>
                <p className='ant-upload-drag-icon'>
                  <InboxOutlined />
                </p>
                <p className='ant-upload-text'>{t('incomingDocDetailPage.form.fileHelper')}</p>
              </Dragger>
            </Form.Item>

            <div className='mb-10'></div>

            <div className='linked-documents'>
              <div className='flex justify-between linked-header'>
                <div className='linked-label font-semibold'>
                  {t('incomingDocDetailPage.linked_document.title')}
                </div>
                <div
                  className='text-primary pr-2'
                  onClick={() => {
                    setOpenLinkDocumentModal(true);
                  }}>
                  <PlusCircleOutlined />
                  <span className='ml-2 cursor-pointer'>
                    {t('incomingDocDetailPage.linked_document.add')}
                  </span>
                </div>
              </div>

              <List
                itemLayout='horizontal'
                dataSource={linkedDocuments.data}
                renderItem={(item) => (
                  // eslint-disable-next-line react/jsx-key
                  <List.Item actions={[<CloseCircleOutlined />]}>
                    <List.Item.Meta
                      title={
                        <div
                          onClick={() => {
                            globalNavigate(`/docout/out-detail/${item.id}`);
                          }}>
                          <span className='cursor-pointer text-primary text-link mr-2'>
                            {item.name}
                          </span>
                          {item.outgoingNumber && (
                            <span>
                              {item.outgoingNumber}/{item.originalSymbolNumber}
                            </span>
                          )}
                        </div>
                      }
                      description={item.summary}
                    />
                  </List.Item>
                )}
              />
            </div>
          </Col>
        </Row>
      </Form>
      <Row className='my-3 mb-10'>
        <DocButtonList
          enableEditing={enableEditing}
          isEditing={isEditing}
          onFinishEditing={onFinishEditing}
          documentDetail={selectedDocs[0]}
          onOpenTransferModal={handleOnOpenModal}
        />
      </Row>
      <div className='text-lg text-primary'>
        {t('common.processing_step.processing_step_in.title')}
      </div>
      <Row className='my-10'>
        <Col span={16}>
          <ProcessingStepComponent
            processingDocumentType={ProcessingDocumentTypeEnum.INCOMING_DOCUMENT}
          />
        </Col>
      </Row>
      <div className='text-lg text-primary'>{t('common.comment.title')}</div>
      <Row>
        <Col span={16}>
          <DocComment
            docId={Number(docId)}
            processingDocumentType={ProcessingDocumentTypeEnum.INCOMING_DOCUMENT}
          />
        </Col>
      </Row>
      {data?.data?.isDocTransferred || data?.data?.isDocCollaborator ? (
        <TransferDocModalDetail
          form={modalForm}
          isModalOpen={isModalOpen}
          handleClose={handleOnCancelModal}
          transferredDoc={selectedDocs[0]}
          transferDocumentDetail={transferDocumentDetail as GetTransferDocumentDetailCustomResponse}
          type={'IncomingDocument'}
          loading={loading}
        />
      ) : (
        <TransferDocModal
          form={modalForm}
          isModalOpen={isModalOpen}
          isSubmitLoading={isSubmitLoading}
          handleCancel={handleOnCancelModal}
          handleOk={handleOnOkModal}
          selectedDocs={selectedDocs}
          type={'IncomingDocument'}
        />
      )}

      {/* <LinkDocumentModal
        selectedDocuments={linkedDocuments.data}
        isIncomingDocument={true}
        isModalOpen={openLinkDocumentModal}
        handleOk={handleOnCancelLinkModal}
        handleCancel={handleOnCancelLinkModal}
      /> */}
    </Skeleton>
  );
}

const IncomingDocPageWrapper = () => (
  <RecoilRoot>
    <IncomingDocPage />
  </RecoilRoot>
);
export default IncomingDocPageWrapper;
