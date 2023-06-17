/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-06-17 15:09:50.

export interface CommentDto extends DocAbstractDto {
    content: string;
    processingDocumentType: ProcessingDocumentTypeEnum;
}

export interface DepartmentDto extends DocAbstractDto {
    departmentName: string;
    truongPhong?: TruongPhongDto;
    description?: string;
}

export interface DepartmentSearchCriteria {
    departmentName: string;
}

export interface DistributionOrganizationDto extends DocAbstractDto {
    name: string;
    symbol: string;
}

export interface DocAbstractDto {
    id: number;
    version: number;
    createdDate?: DateAsString;
    createdBy?: string;
}

export interface DocPaginationDto<T> {
    totalPages: number;
    totalElements: number;
    payload: T[];
}

export interface DocumentReminderDetailsDto extends DocAbstractDto {
    incomingNumber: string;
    summary: string;
    expirationDate: DateAsString;
    status: DocumentReminderStatusEnum;
    incomingDocumentId: number;
}

export interface DocumentTypeDto extends DocAbstractDto {
    type: string;
    description?: string;
}

export interface DocumentTypeSearchCriteria {
}

export interface DocumentTypeStatisticsDto {
    name: string;
    value: number;
}

export interface DocumentTypeStatisticsWrapperDto {
    seriesData: DocumentTypeStatisticsDto[];
    xaxisData: string[];
}

export interface ExtendRequestDto extends DocAbstractDto {
    processingUserId: number;
    oldDeadline: DateAsString;
    status: ExtendRequestStatus;
    documentToExtendId: number;
    newDeadline: DateAsString;
    reason: string;
    validatorId?: number;
}

export interface FolderDto extends DocAbstractDto {
    folderName: string;
    nextNumber: number;
    year: number;
}

export interface IncomingDocumentDto extends DocAbstractDto {
    ordinalNumber: number;
    name: string;
    status: ProcessingStatus;
    processingDuration: DateAsString;
    incomingNumber: string;
    documentType: DocumentTypeDto;
    originalSymbolNumber: string;
    distributionOrg: DistributionOrganizationDto;
    distributionDate: DateAsString;
    arrivingDate: DateAsString;
    arrivingTime: DateAsString;
    summary: string;
    sendingLevel: SendingLevelDto;
    folder: FolderDto;
    attachments: AttachmentDto[];
    urgency: Urgency;
    confidentiality: Confidentiality;
    isDocTransferred: boolean;
    isDocCollaborator: boolean;
}

export interface IncomingDocumentPostDto {
    name: string;
    incomingNumber: string;
    documentType: number;
    originalSymbolNumber: string;
    distributionOrg: number;
    distributionDate: DateAsString;
    arrivingDate: DateAsString;
    arrivingTime: DateAsString;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    folder: number;
}

export interface IncomingDocumentPutDto extends DocAbstractDto {
    name: string;
    incomingNumber: string;
    documentType: number;
    originalSymbolNumber: string;
    distributionOrg: number;
    distributionDate: DateAsString;
    arrivingDate: DateAsString;
    arrivingTime: DateAsString;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    folder: number;
}

export interface TransferDocumentModalSettingDto {
    menuConfigs: TransferDocumentMenuConfig[];
    currentRole: DocSystemRoleEnum;
    defaultTransferDocumentType: TransferDocumentType;
    defaultComponentKey: number;
}

export interface IncomingDocumentStatisticsDto {
    numberOfUnprocessedDocument: number;
    numberOfProcessingDocument: number;
    numberOfProcessedDocument: number;
}

export interface OutgoingDocSearchCriteriaDto {
    outgoingNumber: string;
    originalSymbolNumber: string;
    documentTypeId: number;
    releaseDateFrom: DateAsString;
    releaseDateTo: DateAsString;
    summary: string;
}

export interface OutgoingDocumentGetDto extends DocAbstractDto {
    ordinalNumber: number;
    name: string;
    outgoingNumber: string;
    originalSymbolNumber: string;
    recipient: string;
    signer: string;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    documentType: DocumentTypeDto;
    folder: FolderDto;
    releaseDate: DateAsString;
    publishingDepartment: DepartmentDto;
    status: OutgoingDocumentStatusEnum;
    attachments: AttachmentDto[];
    isDocTransferred: boolean;
    isDocCollaborator: boolean;
}

export interface OutgoingDocumentPostDto extends DocAbstractDto {
    name: string;
    documentType: number;
    originalSymbolNumber: string;
    folder: number;
    publishingDepartment: number;
    recipient: string;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    publishingDate: DateAsString;
}

export interface OutgoingDocumentPutDto extends DocAbstractDto {
    name: string;
    outgoingNumber: string;
    originalSymbolNumber: string;
    recipient: string;
    signer: string;
    summary: string;
    urgency: Urgency;
    releaseDate: DateAsString;
    confidentiality: Confidentiality;
    documentType: number;
    folder: number;
    publishingDepartment: number;
}

export interface PublishDocumentDto extends DocAbstractDto {
    name: string;
    outgoingNumber: string;
    originalSymbolNumber: string;
    recipient: string;
    signer: string;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    releaseDate: DateAsString;
    documentType: number;
    folder: number;
    publishingDepartment: number;
}

export interface ProcessingDetailsDto {
    incomingNumber: string;
    outgoingNumber: string;
    step: number;
    processingUser: ProcessingUserDto;
}

export interface ProcessingUserDto {
    id: number;
    fullName: string;
    role: ProcessingDocumentRoleEnum;
    department: string;
    docSystemRole: DocSystemRoleEnum;
}

export interface SearchCriteriaDto {
    incomingNumber: string;
    originalSymbolNumber: string;
    documentTypeId: number;
    distributionOrgId: number;
    arrivingDateFrom: DateAsString;
    arrivingDateTo: DateAsString;
    processingDurationFrom: DateAsString;
    processingDurationTo: DateAsString;
    summary: string;
}

export interface SendingLevelDto extends DocAbstractDto {
    level: string;
}

export interface StatisticsWrapperDto {
    incomingDocumentStatisticsDto: IncomingDocumentStatisticsDto;
    documentTypeStatisticsWrapperDto: DocumentTypeStatisticsWrapperDto;
    quarter: number;
    year: number;
}

export interface GetTransferDocumentDetailCustomResponse {
    baseInfo: GetTransferDocumentDetailResponse;
    assigneeId: number;
    collaboratorIds: number[];
    senderName: string;
}

export interface GetTransferDocumentDetailRequest {
    documentId: number;
    userId: number;
    role: ProcessingDocumentRoleEnum;
    step: number;
}

export interface GetTransferDocumentDetailResponse {
    documentId: number;
    documentNumber: string;
    summary: string;
    processingDocumentId: number;
    transferDate: DateAsString;
    processingStatus: ProcessingStatus;
    processingDuration: DateAsString;
    isInfiniteProcessingTime: boolean;
    step: number;
    processMethod: ProcessMethod;
    userId: number;
    role: ProcessingDocumentRoleEnum;
}

export interface TransferDocDto {
    documentIds?: number[];
    summary?: string;
    reporterId?: number;
    assigneeId?: number;
    collaboratorIds?: number[];
    processingTime?: string;
    isInfiniteProcessingTime?: boolean;
    processMethod?: ProcessMethod;
    transferDocumentType: TransferDocumentType;
    isTransferToSameLevel: boolean;
}

export interface ValidateTransferDocDto {
    isValid: boolean;
    message: string;
}

export interface GetTransferDocumentHistoryResponse {
    transferHistoryDtos: TransferHistoryDto[];
}

export interface TransferHistoryDto {
    id: number;
    documentIds: number[];
    createdDate: DateAsString;
    processingDuration: DateAsString;
    isInfiniteProcessingTime: boolean;
    isTransferToSameLevel: boolean;
    processMethod: string;
    senderId: number;
    senderName: string;
    receiverId: number;
    receiverName: string;
}

export interface TransferHistorySearchCriteriaDto {
    userId: number;
}

export interface TruongPhongDto {
    id: number;
    fullName: string;
}

export interface UserDepartmentDto extends UserDto {
    departmentName: string;
}

export interface UserDto extends DocAbstractDto {
    username: string;
    email: string;
    fullName: string;
    password: string;
    role: DocSystemRoleEnum;
    department: DepartmentDto;
}

export interface UserSearchCriteria {
    username: string;
    email: string;
    fullName: string;
    role: DocSystemRoleEnum;
    departmentId: number;
}

export interface AttachmentDto extends DocAbstractDto {
    docId: number;
    alfrescoFileId: string;
    alfrescoFolderId: string;
    fileType: FileType;
}

export interface TransferDocumentMenuConfig {
    transferDocumentTypeLabel: string;
    componentKey: number;
    menuLabel: string;
    menuKey: number;
    transferDocumentType: TransferDocumentType;
    isTransferToSameLevel: boolean;
}

export type DateAsString = string;

export const enum Confidentiality {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export const enum ProcessMethod {
    BAO_CAO_KET_QUA = "BAO_CAO_KET_QUA",
    LUU_THAM_KHAO = "LUU_THAM_KHAO",
    SOAN_VAN_BAN = "SOAN_VAN_BAN",
}

export const enum TransferDocumentComponent {
    TRANSFER_TO_GIAM_DOC = "TRANSFER_TO_GIAM_DOC",
    TRANSFER_TO_TRUONG_PHONG = "TRANSFER_TO_TRUONG_PHONG",
    TRANSFER_TO_VAN_THU = "TRANSFER_TO_VAN_THU",
    TRANSFER_TO_CHUYEN_VIEN = "TRANSFER_TO_CHUYEN_VIEN",
}

export const enum TransferDocumentType {
    TRANSFER_TO_GIAM_DOC = "TRANSFER_TO_GIAM_DOC",
    TRANSFER_TO_TRUONG_PHONG = "TRANSFER_TO_TRUONG_PHONG",
    TRANSFER_TO_VAN_THU = "TRANSFER_TO_VAN_THU",
    TRANSFER_TO_CHUYEN_VIEN = "TRANSFER_TO_CHUYEN_VIEN",
}

export const enum Urgency {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export const enum ProcessingDocumentTypeEnum {
    INCOMING_DOCUMENT = "INCOMING_DOCUMENT",
    OUTGOING_DOCUMENT = "OUTGOING_DOCUMENT",
}

export const enum DocumentReminderStatusEnum {
    ACTIVE = "ACTIVE",
    CLOSE_TO_EXPIRATION = "CLOSE_TO_EXPIRATION",
    EXPIRED = "EXPIRED",
}

export const enum ExtendRequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export const enum ProcessingStatus {
    UNPROCESSED = "UNPROCESSED",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
}

export const enum DocSystemRoleEnum {
    GIAM_DOC = "GIAM_DOC",
    CHUYEN_VIEN = "CHUYEN_VIEN",
    TRUONG_PHONG = "TRUONG_PHONG",
    VAN_THU = "VAN_THU",
    DOC_ADMIN = "DOC_ADMIN",
}

export const enum OutgoingDocumentStatusEnum {
    UNPROCESSED = "UNPROCESSED",
    IN_PROGRESS = "IN_PROGRESS",
    WAITING_FOR_OUTGOING_NUMBER = "WAITING_FOR_OUTGOING_NUMBER",
    READY_TO_RELEASE = "READY_TO_RELEASE",
    RELEASED = "RELEASED",
}

export const enum ProcessingDocumentRoleEnum {
    ASSIGNEE = "ASSIGNEE",
    REPORTER = "REPORTER",
    COLLABORATOR = "COLLABORATOR",
}

export const enum FileType {
    PDF = "PDF",
    PNG = "PNG",
    JPG = "JPG",
}
