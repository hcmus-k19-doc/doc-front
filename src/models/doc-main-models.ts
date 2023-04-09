/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-04-05 20:20:10.

export interface DistributionOrganizationDto extends DocAbstractDto {
    name: string;
    symbol: string;
}

export interface DocAbstractDto {
    id: number;
    version: number;
}

export interface DocPaginationDto<T> {
    totalPages: number;
    totalElements: number;
    payload: T[];
}

export interface DocumentTypeDto extends DocAbstractDto {
    type: string;
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
}

export interface UserDto extends DocAbstractDto {
    username: string;
    email: string;
    fullName: string;
    role: DocSystemRoleEnum;
}

export interface AttachmentDto extends DocAbstractDto {
    incomingDocId: number;
    alfrescoFileId: string;
    alfrescoFolderId: string;
    fileType: FileType;
}

export type DateAsString = string;

export const enum Confidentiality {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export const enum Urgency {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
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
}

export const enum FileType {
    PDF = "PDF",
    PNG = "PNG",
    JPG = "JPG",
}
