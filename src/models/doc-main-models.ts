/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-05-13 22:19:59.

export interface CommentDto extends DocAbstractDto {
    content: string;
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
    processingDocumentId: number;
}

export interface DocumentTypeDto extends DocAbstractDto {
    type: string;
}

export interface DocumentTypeSearchCriteria {
}

export interface FolderDto extends DocAbstractDto {
    folderName: string;
    nextNumber: number;
    year: number;
}

export interface IncomingDocumentDto extends DocAbstractDto {
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
}

export interface IncomingDocumentPostDto {
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
    defaultComponent: string;
}

export interface OutgoingDocumentGetDto {
    outgoingNumber: string;
    recipient: string;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    documentType: DocumentTypeDto;
    folder: FolderDto;
    releaseDate: DateAsString;
    publishingDepartment: DepartmentDto;
}

export interface OutgoingDocumentPostDto {
    documentType: number;
    folder: number;
    publishingDepartment: number;
    recipient: string;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    publishingDate: DateAsString;
}

export interface ProcessingDetailsDto {
    incomingNumber: string;
    step: number;
    processingUser: ProcessingUserDto;
}

export interface ProcessingUserDto {
    id: number;
    fullName: string;
    role: ProcessingDocumentRoleEnum;
    department: string;
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
    incomingDocId: number;
    alfrescoFileId: string;
    alfrescoFolderId: string;
    fileType: FileType;
}

export interface TransferDocumentMenuConfig {
    transferDocumentTypeLabel: string;
    component: string;
    menuLabel: string;
    menuKey: number;
    transferDocumentType: TransferDocumentType;
    isTransferToSameLevel: boolean;
}

export interface DepartmentDto extends DocAbstractDto {
    departmentName: string;
    truongPhong?: TruongPhongDto;
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

export const enum DocumentReminderStatusEnum {
    ACTIVE = "ACTIVE",
    CLOSE_TO_EXPIRATION = "CLOSE_TO_EXPIRATION",
    EXPIRED = "EXPIRED",
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
