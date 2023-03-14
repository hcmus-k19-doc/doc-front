/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-14 09:25:44.

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
    arrivingDate: DateAsString;
    summary: string;
    sendingLevel: SendingLevelDto;
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

export const enum DocSystemRoleEnum {
    DIRECTOR = "DIRECTOR",
    EXPERT = "EXPERT",
    MANAGER = "MANAGER",
    STAFF = "STAFF",
}
