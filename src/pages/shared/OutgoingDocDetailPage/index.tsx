import React, { useEffect, useState } from 'react';
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
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  List,
  message,
  Modal,
  Row,
  Select,
  Skeleton,
  UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import { useAuth } from 'components/AuthComponent';
import DocComment from 'components/DocComment';
import DocStatus from 'components/DocStatus';
import ProcessingStepComponent from 'components/ProcessingStepComponent';
import TransferDocModal from 'components/TransferDocModal';
import TransferOutgoingDocModalDetail from 'components/TransferDocModal/components/TransferOutgoingDocModalDetail';
import { PRIMARY_COLOR } from 'config/constant';
import dayjs from 'dayjs';
import {
  Confidentiality,
  DepartmentDto,
  DocSystemRoleEnum,
  DocumentTypeDto,
  FolderDto,
  GetTransferDocumentDetailCustomResponse,
  GetTransferDocumentDetailRequest,
  OutgoingDocumentGetDto,
  OutgoingDocumentPutDto,
  OutgoingDocumentStatusEnum,
  ProcessingDocumentRoleEnum,
  ProcessingDocumentTypeEnum,
  PublishDocumentDto,
  TransferDocDto,
  Urgency,
  UserDto,
} from 'models/doc-main-models';
import { transferDocModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { RecoilRoot, useRecoilValue } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useOutgoingDocumentDetailQuery } from 'shared/hooks/OutgoingDocumentDetailQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';
import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';
import { globalNavigate } from 'utils/RoutingUtils';
import { getStepOutgoingDocument } from 'utils/TransferDocUtils';

import './index.css';
import { useDocOutLinkedDocumentsQuery } from 'shared/hooks/LinkedDocumentsQuery/OutgoingDocument';

const { confirm } = Modal;

function OutgoingDocDetailPage() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const { docId } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();
  const showAlert = useSweetAlert();

  const [isEditing, setIsEditing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const linkedDocuments = useDocOutLinkedDocumentsQuery(+(docId || 1));
  const [foldersQuery, documentTypesQuery, , departmentsQuery] = useDropDownFieldsQuery();

  const { isLoading, data, isFetching } = useOutgoingDocumentDetailQuery(+(docId || 1));
  const [selectedDocs, setSelectedDocs] = useState<OutgoingDocumentGetDto[]>([]);
  const transferDocModalItem = useRecoilValue(transferDocModalState);
  const transferQuerySetter = useTransferQuerySetter();
  const navigate = useNavigate();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [, setError] = useState<string>();
  const [transferDocumentDetail, setTransferDocumentDetail] =
    useState<GetTransferDocumentDetailCustomResponse>();

  const fetchForm = () => {
    if (!isLoading) {
      if (data?.data) {
        const outgoingDocumentTransfer = {
          ...data?.data,
          status: t(`PROCESSING_STATUS.${data?.data.status}`),
          objType: 'OutgoingDocument',
        };
        setSelectedDocs([outgoingDocumentTransfer as unknown as OutgoingDocumentGetDto]);

        const outgoingDocument: OutgoingDocumentGetDto = data?.data;

        initForm(outgoingDocument);

        if (outgoingDocument.status === OutgoingDocumentStatusEnum.RELEASED) {
          removeButtons();
        }
      } else {
        globalNavigate('error');
      }
    }
  };

  useEffect(() => {
    fetchForm();
  }, [isLoading, isReleased, data?.data]);

  const initForm = (outgoingDocument: OutgoingDocumentGetDto) => {
    form.setFieldsValue({
      name: outgoingDocument.name,
      folder: outgoingDocument.folder?.id,
      outgoingNumber: outgoingDocument.outgoingNumber,
      documentType: outgoingDocument.documentType?.id,
      publishingDepartment: outgoingDocument.publishingDepartment?.id,
      urgency: outgoingDocument.urgency,
      confidentiality: outgoingDocument.confidentiality,
      originalSymbolNumber: outgoingDocument.originalSymbolNumber,
      recipient: outgoingDocument.recipient,
      releaseDate: outgoingDocument.releaseDate ? dayjs(outgoingDocument.releaseDate) : null,
      summary: outgoingDocument.summary,
      signer: outgoingDocument.signer,
    });
  };

  const onCancel = () => {
    setIsEditing(false);
    setIsReviewing(false);
    form.resetFields();
    fetchForm();
  };

  const renderFolders = () => {
    return foldersQuery.data?.map((folder: FolderDto) => (
      <Select.Option key={folder.id} value={folder.id}>
        {folder.folderName}
      </Select.Option>
    ));
  };

  const renderDepartments = () => {
    return departmentsQuery.data?.map((org: DepartmentDto) => (
      <Select.Option key={org.id} value={org.id}>
        {org.departmentName}
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
        message.success(`${info.file.name} ${t('outgoing_doc_detail_page.message.file_success')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('outgoing_doc_detail_page.message.file_error')}`);
      }
    },
  };

  const saveChange = async (values: any) => {
    try {
      delete values.files;

      const document: OutgoingDocumentPutDto = {
        ...values,
        id: +(docId || 0),
        releaseDate: values.releaseDate ? new Date(values.releaseDate) : null,
      };

      const response = await outgoingDocumentService.updateOutgoingDocument(document);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: `${t('outgoing_doc_detail_page.message.edit_success')}`,
          showConfirmButton: false,
          timer: 2000,
        });
        setIsEditing(false);
        queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);
      }
    } catch (error) {
      showAlert({
        icon: 'error',
        html: `${t('outgoing_doc_detail_page.message.error')}`,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const getReleaseNumberFromFolder = () => {
    const folder = foldersQuery.data?.find(
      (folder: FolderDto) => folder.id === form.getFieldValue('folder')
    );
    const nextNumber = folder?.nextNumber;
    const year = folder?.year;

    if (!nextNumber || !year) {
      return null;
    }

    if (nextNumber < 10) {
      return `0${nextNumber}/${year}`;
    }

    return `${nextNumber}/${year}`;
  };

  const onPublishReview = () => {
    const data = {
      ...form.getFieldsValue(),
      outgoingNumber: getReleaseNumberFromFolder(),
      signer: currentUser?.fullName,
      releaseDate: dayjs(),
    };
    setIsReviewing(true);
    form.setFieldsValue(data);
  };

  const removeButtons = () => {
    setIsEditing(false);
    setIsReviewing(false);
    setIsReleased(true);
  };

  const publishDocument = async () => {
    try {
      const formValues = form.getFieldsValue();

      delete formValues.files;

      const document: PublishDocumentDto = {
        id: +(docId || 0),
        ...formValues,
      };

      const response = await outgoingDocumentService.publishOutgoingDocument(document);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: `${t('outgoing_doc_detail_page.message.publish_success')}`,
          showConfirmButton: false,
          timer: 2000,
        });

        queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);

        removeButtons();
      }
    } catch (error) {
      showAlert({
        icon: 'error',
        html: `${t('outgoing_doc_detail_page.message.error')}`,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    }
  };

  const onPublishConfirm = () => {
    confirm({
      icon: <QuestionCircleOutlined style={{ color: PRIMARY_COLOR }} />,
      content: <div className='mt-3'>{t('outgoing_doc_detail_page.message.confirm_publish')}</div>,
      okText: t('outgoing_doc_detail_page.button.publish_modal'),
      cancelText: t('outgoing_doc_detail_page.button.cancel'),

      onOk: publishDocument,
    });
  };

  const handleOnOpenModal = async () => {
    setIsModalOpen(true);

    if (selectedDocs[0].isDocTransferred || selectedDocs[0].isDocCollaborator) {
      const getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest = {
        documentId: +(docId || 1),
        userId: currentUser?.id as number,
        role: ProcessingDocumentRoleEnum.REPORTER,
        step: getStepOutgoingDocument(currentUser as UserDto, true),
      };

      if (selectedDocs[0].isDocCollaborator) {
        getTransferDocumentDetailRequest.role = ProcessingDocumentRoleEnum.COLLABORATOR;
        getTransferDocumentDetailRequest.step = getStepOutgoingDocument(
          currentUser as UserDto,
          false
        );
      }

      try {
        const response = await outgoingDocumentService.getTransferDocumentDetail(
          getTransferDocumentDetailRequest
        );
        setTransferDocumentDetail(response);
      } catch (error) {
        showAlert({
          icon: 'error',
          html: t('outgoingDocListPage.message.get_transfer_document_detail_error'),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
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
        const response = await outgoingDocumentService.transferDocuments(transferDocDto);
        if (response.status === 200) {
          queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 1)]);
          // navigate('/docout/out-list');
          currentUser?.role !== DocSystemRoleEnum.GIAM_DOC
            ? showAlert({
                icon: 'success',
                html: t('outgoing_doc_detail_page.message.report_success') as string,
                showConfirmButton: false,
                timer: 2000,
              })
            : showAlert({
                icon: 'success',
                html: t('outgoing_doc_detail_page.message.transfer_secretary_success') as string,
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
      setIsSubmitLoading(false);
      modalForm.resetFields();
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Skeleton loading={isLoading || isFetching || linkedDocuments.isLoading} active>
        <div className='text-lg text-primary'>{t('outgoing_doc_detail_page.title')}</div>

        {isReleased && <DocStatus status={OutgoingDocumentStatusEnum.RELEASED} />}

        <Form form={form} layout='vertical' disabled={!isEditing} onFinish={saveChange}>
          <Row>
            <Col span={16}>
              <Row>
                <Col span={11}>
                  <Form.Item
                    label={t('outgoing_doc_detail_page.form.doc_folder')}
                    name='folder'
                    required>
                    <Select disabled>{renderFolders()}</Select>
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    label={t('outgoing_doc_detail_page.form.document_type')}
                    name='documentType'
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t('outgoing_doc_detail_page.form.document_type_required')}`,
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
                    label={t('outgoing_doc_detail_page.form.release_number')}
                    name='outgoingNumber'>
                    <Input disabled />
                  </Form.Item>
                </Col>

                <Col span={2}></Col>

                <Col span={11}>
                  <Form.Item
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t(
                          'outgoing_doc_detail_page.form.original_symbol_number_required'
                        )}`,
                      },
                    ]}
                    label={
                      <>
                        <div className='mr-2'>
                          {t('outgoing_doc_detail_page.form.original_symbol_number')}
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
                    name='originalSymbolNumber'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    label={t('outgoing_doc_detail_page.form.distribution_org')}
                    name='publishingDepartment'
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t('outgoing_doc_detail_page.form.distribution_org_required')}`,
                      },
                    ]}>
                    <Select>{renderDepartments()}</Select>
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    label={t('outgoing_doc_detail_page.form.distribution_date')}
                    name='releaseDate'>
                    <DatePicker
                      format={DAY_MONTH_YEAR_FORMAT}
                      className='w-full'
                      disabled
                      placeholder='dd/mm/yyyy'
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item
                    label={t('outgoing_doc_detail_page.form.urgency')}
                    name='urgency'
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t('outgoing_doc_detail_page.form.urgency_required')}`,
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
                    label={t('outgoing_doc_detail_page.form.confidentiality')}
                    name='confidentiality'
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t('outgoing_doc_detail_page.form.confidentiality_required')}`,
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

              <Row>
                <Col span={11}>
                  <Form.Item
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t('outgoing_doc_detail_page.form.receive_org_required')}`,
                      },
                    ]}
                    label={t('outgoing_doc_detail_page.form.receive_org')}
                    name='recipient'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}></Col>
                <Col span={11}>
                  <Form.Item
                    required
                    rules={[
                      {
                        required: true,
                        message: `${t('outgoing_doc_detail_page.form.name_required')}`,
                      },
                    ]}
                    label={t('outgoing_doc_detail_page.form.name')}
                    name='name'>
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={11}>
                  <Form.Item label={t('outgoing_doc_detail_page.form.signer')} name='signer'>
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={t('outgoing_doc_detail_page.form.summary')} name='summary'>
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
              <Form.Item label={t('outgoing_doc_detail_page.form.files')} name='files'>
                <Dragger {...fileProps}>
                  <p className='ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='ant-upload-text'>
                    {t('outgoing_doc_detail_page.form.file_helper')}
                  </p>
                </Dragger>
              </Form.Item>

              <div className='mb-10'></div>

              <div className='linked-documents'>
                <div className='flex justify-between linked-header'>
                  <div className='linked-label font-semibold'>
                    {t('incomingDocDetailPage.linked_document.title')}
                  </div>
                  <div className='text-primary pr-2'>
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
                        title={<a href='https://ant.design'>{item.name}</a>}
                        description={item.summary}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Form>

        {!isReleased && (
          <Row className='my-3 mb-10'>
            {isEditing || isReviewing ? (
              <Button
                type='default'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={() => onCancel()}>
                {t('outgoing_doc_detail_page.button.cancel')}
              </Button>
            ) : (
              <Button
                type='primary'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={() => {
                  setIsEditing(true);
                }}>
                {t('outgoing_doc_detail_page.button.edit')}
              </Button>
            )}

            {isEditing && (
              <Button
                type='primary'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={() => {
                  form.submit();
                }}>
                {t('outgoing_doc_detail_page.button.save')}
              </Button>
            )}

            {isReviewing ? (
              <Button
                type='primary'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={onPublishConfirm}>
                {t('outgoing_doc_detail_page.button.publish')}
              </Button>
            ) : (
              <Button
                type='primary'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={onPublishReview}>
                {t('outgoing_doc_detail_page.button.review')}
              </Button>
            )}

            <Button type='primary' size='large' htmlType='button' onClick={handleOnOpenModal}>
              {data?.data?.isDocTransferred || data?.data?.isDocCollaborator
                ? t('outgoing_doc_detail_page.button.view_transfer_detail')
                : currentUser?.role === DocSystemRoleEnum.CHUYEN_VIEN ||
                  currentUser?.role === DocSystemRoleEnum.TRUONG_PHONG
                ? t('outgoing_doc_detail_page.button.report')
                : t('outgoing_doc_detail_page.button.transfer_secretary')}
            </Button>
          </Row>
        )}
        <div className='text-lg text-primary'>
          {t('common.processing_step.processing_step_out.title')}
        </div>
        <Row className='my-10'>
          <Col span={16}>
            <ProcessingStepComponent
              processingDocumentType={ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT}
            />
          </Col>
        </Row>
        <div className='text-lg text-primary'>{t('common.comment.title')}</div>
        <Row>
          <Col span={16}>
            <DocComment
              docId={Number(docId)}
              processingDocumentType={ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT}
            />
          </Col>
        </Row>
        {data?.data?.isDocTransferred || data?.data?.isDocCollaborator ? (
          <TransferOutgoingDocModalDetail
            form={modalForm}
            isModalOpen={isModalOpen}
            handleClose={handleOnCancelModal}
            transferredDoc={selectedDocs[0]}
            transferDocumentDetail={
              transferDocumentDetail as GetTransferDocumentDetailCustomResponse
            }
            type={'OutgoingDocument'}
          />
        ) : (
          <TransferDocModal
            form={modalForm}
            isModalOpen={isModalOpen}
            isSubmitLoading={isSubmitLoading}
            handleCancel={handleOnCancelModal}
            handleOk={handleOnOkModal}
            selectedDocs={selectedDocs}
            type={'OutgoingDocument'}
          />
        )}
      </Skeleton>
    </>
  );
}

const OutgoingDocPageWrapper = () => (
  <RecoilRoot>
    <OutgoingDocDetailPage />
  </RecoilRoot>
);

export default OutgoingDocPageWrapper;
