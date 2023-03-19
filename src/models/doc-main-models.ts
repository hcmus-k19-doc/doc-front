/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-20 00:50:38.

export interface DistributionOrganizationDto extends DocAbstractDto {
    name: string;
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
    incomingNumber: string;
    documentType: DocumentTypeDto;
    originalSymbolNumber: string;
    distributionOrg: DistributionOrganizationDto;
    distributionDate: DateAsString;
    arrivingDate: DateAsString;
    arrivingTime: DateAsString;
    summary: string;
    urgency: Urgency;
    confidentiality: Confidentiality;
    status: string;
    folder: string;
    processingDuration: DateAsString;
    sendingLevel: SendingLevelDto;
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
