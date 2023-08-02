import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
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
  Typography,
  Upload,
  UploadProps,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import TextArea from 'antd/es/input/TextArea';
import { RcFile, UploadFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import axios from 'axios';
import Attachments from 'components/Attachments';
import { useAuth } from 'components/AuthComponent';
import DocComment from 'components/DocComment';
import DocStatus from 'components/DocStatus';
import LinkDocumentModal from 'components/LinkDocumentModal';
import ProcessingStepComponent from 'components/ProcessingStepComponent';
import ReturnRequest from 'components/ReturnRequest';
import TransferDocModal from 'components/TransferDocModal';
import TransferOutgoingDocModalDetail from 'components/TransferDocModal/components/TransferOutgoingDocModalDetail';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, PRIMARY_COLOR } from 'config/constant';
import dayjs from 'dayjs';
import {
  AttachmentDto,
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
  ReturnRequestPostDto,
  ReturnRequestType,
  TransferDocDto,
  Urgency,
  UserDto,
} from 'models/doc-main-models';
import { transferDocModalState } from 'pages/shared/IncomingDocListPage/core/states';
import { RecoilRoot, useRecoilValue } from 'recoil';
import outgoingDocumentService from 'services/OutgoingDocumentService';
import returnRequestService from 'services/ReturnRequestService';
import { useDropDownFieldsQuery } from 'shared/hooks/DropdownFieldsQuery';
import { useDocOutLinkedDocumentsQuery } from 'shared/hooks/LinkedDocumentsQuery/OutgoingDocument';
import { useOutgoingDocumentDetailQuery } from 'shared/hooks/OutgoingDocumentDetailQuery';
import { useSweetAlert } from 'shared/hooks/SwalAlert';
import { initialTransferQueryState, useTransferQuerySetter } from 'shared/hooks/TransferDocQuery';
import { validateTransferDocs } from 'shared/validators/TransferDocValidator';
import {
  DAY_MONTH_YEAR_FORMAT,
  formatDateToDDMMYYYY,
  isValidDateFormat,
} from 'utils/DateTimeUtils';
import { globalNavigate } from 'utils/RoutingUtils';
import { getStepOutgoingDocument } from 'utils/TransferDocUtils';

import './index.css';

const { confirm } = Modal;
const { Title } = Typography;
function OutgoingDocDetailPage() {
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  const { docId } = useParams();
  const { t } = useTranslation();
  const [form] = useForm();
  const showAlert = useSweetAlert();

  const [openLinkDocumentModal, setOpenLinkDocumentModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isReleased, setIsReleased] = useState(false);

  const linkedDocuments = useDocOutLinkedDocumentsQuery(+(docId || 1));
  const [foldersQuery, documentTypesQuery, , departmentsQuery] = useDropDownFieldsQuery();

  const { isLoading, data, isFetching } = useOutgoingDocumentDetailQuery(+(docId || 1));
  const [selectedDocs, setSelectedDocs] = useState<OutgoingDocumentGetDto[]>([]);
  const transferDocModalItem = useRecoilValue(transferDocModalState);
  const transferQuerySetter = useTransferQuerySetter();
  const [modalForm] = useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [, setError] = useState<string>();
  const [transferDocumentDetail, setTransferDocumentDetail] =
    useState<GetTransferDocumentDetailCustomResponse>();

  const [selectedDocumentsToLink, setSelectedDocumentsToLink] = useState([]);

  const [modal, contextHolder] = Modal.useModal();
  const [loading, setLoading] = useState<boolean>(false);
  const [attachmentList, setAttachmentList] = useState<AttachmentDto[]>([]);

  // RETURN REQUEST SECTION
  const [returnType, setReturnType] = useState<ReturnRequestType>(ReturnRequestType.SEND_BACK);
  const [isReturnRequestModalOpen, setIsReturnRequestModalOpen] = useState<boolean>(false);
  const [returnRequestReason, setReturnRequestReason] = useState<string>('');

  const showReturnRequestModal = async () => {
    setIsReturnRequestModalOpen(true);
    await handleLoadTransferDocumentDetail();
  };

  const hideReturnRequestModal = () => {
    setIsReturnRequestModalOpen(false);
  };

  const onReturnRequestReasonChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setReturnRequestReason(e.target.value);
  };

  const handleReturnRequest = async () => {
    const returnRequestPostDto: ReturnRequestPostDto = {
      currentProcessingUserId: transferDocumentDetail?.assigneeId || -1,
      previousProcessingUserId: currentUser?.id || -1,
      documentIds: [data?.data?.id || -1],
      documentType: ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT,
      reason: returnRequestReason,
      step: getStepOutgoingDocument(currentUser as UserDto, true),
      returnRequestType: returnType,
    };
    if (returnType === ReturnRequestType.SEND_BACK) {
      returnRequestPostDto.currentProcessingUserId = currentUser?.id || -1;
      returnRequestPostDto.previousProcessingUserId = -1;
      returnRequestPostDto.step = getStepOutgoingDocument(currentUser as UserDto, false);
    }
    setLoading(true);
    try {
      const response = await returnRequestService.createReturnRequest(returnRequestPostDto);

      showAlert({
        icon: 'success',
        html:
          returnType === ReturnRequestType.WITHDRAW
            ? t('withdraw.success')
            : t('send_back.success'),
        showConfirmButton: true,
      });
      setReturnRequestReason('');
      hideReturnRequestModal();
      queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        showAlert({
          icon: 'warning',
          html: t(
            error.response?.data.message ||
              (returnType === ReturnRequestType.WITHDRAW ? 'withdraw.error' : 'send_back.error')
          ),
          confirmButtonColor: PRIMARY_COLOR,
          confirmButtonText: 'OK',
        });
      } else {
        console.error(error);
      }
      queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);
      hideReturnRequestModal();
    } finally {
      setLoading(false);
    }
  };
  // END RETURN REQUEST SECTION

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
    setAttachmentList(data?.data?.attachments || []);
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
    maxCount: 3 - attachmentList.length,
    customRequest: dummyRequest,
    beforeUpload: (file: RcFile) => {
      const isValidSize = file.size < MAX_FILE_SIZE;
      const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
      // Check file duplicate
      const isDuplicate = form
        .getFieldValue('files')
        ?.fileList?.find((f: UploadFile) => f.name === file.name);
      // Check file max count
      const isMaxCount =
        form.getFieldValue('files')?.fileList?.length === undefined
          ? attachmentList.length + 1 > 3
          : form.getFieldValue('files')?.fileList?.length + attachmentList.length + 1 > 3;
      const isExisted = attachmentList.find((attachment) => attachment.fileName === file.name);
      if (isMaxCount) {
        message.error(t('create_outgoing_doc_page.message.file_max_count_error') as string);
      } else {
        if (isDuplicate) {
          message.error(t('create_outgoing_doc_page.message.file_duplicate_error') as string);
        } else {
          if (isExisted) {
            message.error(t('create_outgoing_doc_page.message.file_duplicate_error') as string);
          } else {
            // Check file type
            if (!isValidType) {
              message.error(t('create_outgoing_doc_page.message.file_type_error') as string);
            } else {
              // Check file size (max 5MB)
              if (!isValidSize) {
                message.error(t('create_outgoing_doc_page.message.file_size_error') as string);
              }
            }
          }
        }
      }

      return (
        (isValidType && isValidSize && !isDuplicate && !isExisted && !isMaxCount) ||
        Upload.LIST_IGNORE
      );
    },
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} ${t('create_outgoing_doc_page.message.file_success')}`);
      } else if (status === 'error') {
        message.error(`${info.file.name} ${t('create_outgoing_doc_page.message.file_error')}`);
      }
    },
  };

  const saveChange = async (values: any) => {
    try {
      setIsSaving(true);

      const outgoingDocument = new FormData();
      if (values.files !== undefined) {
        values.files.fileList.forEach((file: any) => {
          outgoingDocument.append('attachments', file.originFileObj);
        });
        delete values.files;
      }

      const outgoingDocumentPutDto: OutgoingDocumentPutDto = {
        ...values,
        id: +(docId || 0),
        releaseDate: values.releaseDate ? new Date(values.releaseDate) : null,
      };
      outgoingDocument.append('outgoingDocumentPutDto', JSON.stringify(outgoingDocumentPutDto));
      const response = await outgoingDocumentService.updateOutgoingDocument(outgoingDocument);

      if (response.status === 200) {
        showAlert({
          icon: 'success',
          html: `${t('outgoing_doc_detail_page.message.edit_success')}`,
          showConfirmButton: false,
          timer: 2000,
        });
        setIsEditing(false);
        form.resetFields();
        fetchForm();
        queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);
      }
    } catch (error) {
      showAlert({
        icon: 'error',
        html: `${t('outgoing_doc_detail_page.message.error')}`,
        confirmButtonColor: PRIMARY_COLOR,
        confirmButtonText: 'OK',
      });
    } finally {
      setIsSaving(false);
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
      signer: currentUser?.username,
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
      setIsReleasing(true);
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
    } finally {
      setIsReleasing(false);
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

  const handleLoadTransferDocumentDetail = async () => {
    if (selectedDocs?.[0]?.isDocTransferred || selectedDocs?.[0]?.isDocCollaborator) {
      const getTransferDocumentDetailRequest: GetTransferDocumentDetailRequest = {
        documentId: +(docId || 1),
        userId: currentUser?.id as number,
        role: ProcessingDocumentRoleEnum.REPORTER,
        step: getStepOutgoingDocument(currentUser as UserDto, true),
      };

      if (selectedDocs?.[0]?.isDocCollaborator) {
        getTransferDocumentDetailRequest.role = ProcessingDocumentRoleEnum.COLLABORATOR;
        getTransferDocumentDetailRequest.step = getStepOutgoingDocument(
          currentUser as UserDto,
          false
        );
      }

      setLoading(true);
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
        queryClient.invalidateQueries(['QUERIES.OUTGOING_DOCUMENT_DETAIL', +(docId || 0)]);
        hideReturnRequestModal();
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOnOpenModal = async () => {
    setIsModalOpen(true);
    await handleLoadTransferDocumentDetail();
  };

  const handleOnCancelModal = () => {
    setIsModalOpen(false);
    modalForm.resetFields();
    transferQuerySetter(initialTransferQueryState);
  };

  const handleOnOkModal = async () => {
    if (!isValidDateFormat(modalForm.getFieldValue('processingTime'))) {
      modalForm.setFieldsValue({
        processingTime: formatDateToDDMMYYYY(modalForm.getFieldValue('processingTime')),
      });
    }
    const transferDocDto: TransferDocDto = {
      documentIds: selectedDocs.map((doc) => doc.id),
      summary: modalForm.getFieldValue('summary'),
      reporterId: currentUser?.id as number,
      assigneeId: modalForm.getFieldValue('assignee') as number,
      collaboratorIds: modalForm.getFieldValue('collaborators') as number[],
      processingTime: modalForm.getFieldValue('processingTime'),
      isInfiniteProcessingTime: modalForm.getFieldValue('isInfiniteProcessingTime'),
      processingMethod: modalForm.getFieldValue('processingMethod'),
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
          currentUser?.role !== DocSystemRoleEnum.HIEU_TRUONG
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

  const handleCancelLinkDocument = () => {
    setOpenLinkDocumentModal(false);
  };

  const handleOkLinkDocument = async () => {
    const documentToLinkIds = selectedDocumentsToLink.map((doc: any) => doc.id);
    await outgoingDocumentService.linkDocuments(+(docId ?? 0), documentToLinkIds);

    queryClient.invalidateQueries(['docout.link_documents', +(docId ?? 1)]);
    setOpenLinkDocumentModal(false);
    setSelectedDocumentsToLink([]);
  };

  const handleDeleteLinkedDocument = async (documentId: number) => {
    modal.confirm({
      title: t('link-document.unlink_modal.title'),
      icon: <ExclamationCircleOutlined />,
      content: t('link-document.unlink_modal.content'),
      okText: t('link-document.unlink_modal.ok_text'),
      cancelText: t('link-document.unlink_modal.cancel_text'),
      onOk: async () => {
        await outgoingDocumentService.unlinkDocument(+(docId ?? 0), documentId);
        queryClient.invalidateQueries(['docout.link_documents', +(docId ?? 1)]);
      },
      centered: true,
    });
  };

  const handleSelectedDocumentsToLinkChanged = (documents: any) => {
    setSelectedDocumentsToLink(documents);
  };

  console.log(linkedDocuments?.data);

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
                  data={form.getFieldValue('summary') || ''}
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

              <Attachments
                attachmentList={attachmentList}
                setAttachmentList={setAttachmentList}
                isReadOnly={false}
                isEditing={isEditing}
              />

              <div className='mb-10'></div>

              <div className='linked-documents'>
                <div className='flex justify-between linked-header'>
                  <div className='linked-label font-semibold'>
                    {t('incomingDocDetailPage.linked_document.title')}
                  </div>
                  {!isReleased && (
                    <div
                      className='text-primary pr-2'
                      onClick={() => {
                        setOpenLinkDocumentModal(true);
                      }}>
                      <PlusCircleOutlined />
                      <span className='ml-2 cursor-pointer text-link'>
                        {t('incomingDocDetailPage.linked_document.add')}
                      </span>
                    </div>
                  )}
                </div>

                <List
                  loading={
                    linkedDocuments.isLoading ||
                    linkedDocuments.isFetching ||
                    linkedDocuments.isInitialLoading
                  }
                  itemLayout='horizontal'
                  dataSource={linkedDocuments.data}
                  renderItem={(item) => (
                    <List.Item
                      actions={[
                        <span
                          key={`delete-${item.id}`}
                          onClick={() => {
                            if (isReleased) return;
                            handleDeleteLinkedDocument(item.id);
                          }}>
                          {!isReleased && <CloseCircleOutlined />}
                        </span>,
                      ]}>
                      <List.Item.Meta
                        title={
                          <div
                            onClick={() => {
                              globalNavigate(`/main/docin/in-detail/${item.id}`);
                            }}>
                            <span className='cursor-pointer text-primary text-link mr-2'>
                              {item.name}
                            </span>
                            <span>
                              {item.incomingNumber}/{item.originalSymbolNumber}
                            </span>
                          </div>
                        }
                        description={<div dangerouslySetInnerHTML={{ __html: item.summary }}></div>}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Form>

        {!isReleased ? (
          <Row className='my-3 mb-10'>
            {isEditing || isReviewing ? (
              <Button
                type='default'
                size='large'
                htmlType='button'
                className='mr-5'
                loading={isSaving || isReleasing}
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
                loading={isSaving}
                onClick={() => {
                  form.submit();
                }}>
                {t('outgoing_doc_detail_page.button.save')}
              </Button>
            )}

            {data?.data?.isReleasable &&
              (isReviewing ? (
                <Button
                  type='primary'
                  size='large'
                  htmlType='button'
                  className='mr-5'
                  loading={isReleasing}
                  hidden={isEditing}
                  onClick={onPublishConfirm}>
                  {t('outgoing_doc_detail_page.button.publish')}
                </Button>
              ) : (
                <Button
                  type='primary'
                  size='large'
                  htmlType='button'
                  className='mr-5'
                  hidden={isEditing}
                  onClick={onPublishReview}>
                  {t('outgoing_doc_detail_page.button.review')}
                </Button>
              ))}

            {currentUser?.role !== DocSystemRoleEnum.VAN_THU && data?.data?.isTransferable && (
              <Button
                type='primary'
                size='large'
                htmlType='button'
                className='mr-5'
                onClick={handleOnOpenModal}
                hidden={isEditing || isReviewing}>
                {data?.data?.isDocTransferred || data?.data?.isDocCollaborator
                  ? t('outgoing_doc_detail_page.button.view_transfer_detail')
                  : currentUser?.role === DocSystemRoleEnum.HIEU_TRUONG
                  ? t('outgoing_doc_detail_page.button.transfer_secretary')
                  : t('outgoing_doc_detail_page.button.report')}
              </Button>
            )}
            {currentUser?.role !== DocSystemRoleEnum.VAN_THU &&
              data?.data?.isDocTransferredByNextUserInFlow === false &&
              !data?.data?.isDocCollaborator &&
              data?.data?.isDocTransferred && (
                <Button
                  key='widthdraw'
                  type='primary'
                  size='large'
                  onClick={() => {
                    setReturnType(ReturnRequestType.WITHDRAW);
                    showReturnRequestModal();
                  }}
                  className='danger-button mr-5'
                  loading={loading || isLoading || isSaving || isReleasing}>
                  {t('transfer_modal.button.withdraw')}
                </Button>
              )}

            {currentUser?.role !== DocSystemRoleEnum.CHUYEN_VIEN &&
              data?.data?.isDocTransferred === false &&
              !data?.data?.isDocCollaborator &&
              data?.data?.isTransferable &&
              data?.data?.createdBy !== currentUser?.username && (
                <Button
                  key='send_back'
                  type='primary'
                  size='large'
                  onClick={() => {
                    setReturnType(ReturnRequestType.SEND_BACK);
                    showReturnRequestModal();
                  }}
                  className='danger-button mr-5'
                  loading={loading || isLoading || isSaving || isReleasing}>
                  {t('transfer_modal.button.send_back')}
                </Button>
              )}
          </Row>
        ) : (
          <Row className='my-3 mb-10'>
            {currentUser?.role !== DocSystemRoleEnum.VAN_THU &&
              (data?.data?.isDocTransferred || data?.data?.isDocCollaborator) && (
                <Button
                  type='primary'
                  size='large'
                  htmlType='button'
                  onClick={handleOnOpenModal}
                  hidden={isEditing || isReviewing}>
                  {t('outgoing_doc_detail_page.button.view_transfer_detail')}
                </Button>
              )}
          </Row>
        )}

        <ReturnRequest
          docId={Number(docId)}
          processingDocumentType={ProcessingDocumentTypeEnum.INCOMING_DOCUMENT}
        />

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

        <div className='comment-section'>
          <div className='text-lg text-primary'>{t('common.comment.title')}</div>
          <Row>
            <Col span={16}>
              <DocComment
                docId={Number(docId)}
                processingDocumentType={ProcessingDocumentTypeEnum.OUTGOING_DOCUMENT}
              />
            </Col>
          </Row>
        </div>

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
            type={'OutgoingDocument'}
          />
        )}

        <LinkDocumentModal
          selectedDocumentsToLink={selectedDocumentsToLink}
          handleSelectedDocumentsToLinkChanged={handleSelectedDocumentsToLinkChanged}
          selectedDocuments={linkedDocuments.data}
          isIncomingDocument={false}
          isModalOpen={openLinkDocumentModal}
          handleOk={handleOkLinkDocument}
          handleCancel={handleCancelLinkDocument}
        />

        {contextHolder}
      </Skeleton>
      <Modal
        title=''
        centered
        open={isReturnRequestModalOpen}
        onOk={handleReturnRequest}
        okText={t('transfer_modal.button.ok')}
        cancelText={t('transfer_modal.button.cancel')}
        onCancel={hideReturnRequestModal}
        // bodyStyle={{ marginBottom: 20 }}
        cancelButtonProps={{ loading: isLoading }}
        confirmLoading={isLoading}>
        <Title level={5}>
          {returnType === ReturnRequestType.WITHDRAW
            ? t('withdraw.input_reason')
            : t('send_back.input_reason')}
        </Title>
        <TextArea
          // showCount
          maxLength={200}
          style={{ height: 100, resize: 'none' }}
          onChange={onReturnRequestReasonChange}
          value={returnRequestReason}
          allowClear
        />
      </Modal>
    </>
  );
}

const OutgoingDocPageWrapper = () => (
  <RecoilRoot>
    <OutgoingDocDetailPage />
  </RecoilRoot>
);

export default OutgoingDocPageWrapper;
