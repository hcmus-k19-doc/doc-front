/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-28 23:25:36.

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
    arrivingDate: DateAsString;
    summary: string;
    sendingLevel: SendingLevelDto;
    folder: FolderDto;
    attachments: AttachmentDto[];
}

export interface IncomingDocumentGetDto {
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

export interface UserDto extends DocAbstractDto {
    username: string;
    email: string;
    fullName: string;
    roles: DocSystemRoleEnum[];
}

export interface AttachmentDto extends DocAbstractDto {
    alfrescoFileId: string;
    alfrescoFolderId: string;
    fileType: string;
    data: MultipartFile;
}

export interface MultipartFile extends InputStreamSource {
    name: string;
    bytes: any;
    empty: boolean;
    resource: Resource;
    size: number;
    originalFilename: string;
    contentType: string;
}

export interface Resource extends InputStreamSource {
    open: boolean;
    file: any;
    readable: boolean;
    url: URL;
    description: string;
    uri: URI;
    filename: string;
}

export interface InputStreamSource {
    inputStream: any;
}

export interface URL {
}

export interface URI extends Comparable<URI> {
}

export interface Comparable<T> {
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
    DIRECTOR = "DIRECTOR",
    EXPERT = "EXPERT",
    MANAGER = "MANAGER",
    STAFF = "STAFF",
}
