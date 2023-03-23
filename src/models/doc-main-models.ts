/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-23 21:56:15.

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
    folder: string;
}

export interface SearchCriteriaDto {
    incomingNumber: string;
    originalSymbolNumber: string;
    documentType: string;
    distributionOrg: string;
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
    roles: DocSystemRoleEnum[];
}

export type DateAsString = string;

export const enum ProcessingStatus {
    UNPROCESSED = "UNPROCESSED",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
}

export const enum Urgency {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export const enum Confidentiality {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
}

export const enum DocSystemRoleEnum {
    DIRECTOR = "DIRECTOR",
    EXPERT = "EXPERT",
    MANAGER = "MANAGER",
    STAFF = "STAFF",
}
