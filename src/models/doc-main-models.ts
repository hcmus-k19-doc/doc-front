/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-15 21:46:47.

export interface UserDto {
    id: number;
    username: string;
    email: string;
    roles: DocSystemRoleEnum[];
}

export const enum DocSystemRoleEnum {
    DIRECTOR = "DIRECTOR",
    EXPERT = "EXPERT",
    MANAGER = "MANAGER",
    STAFF = "STAFF",
}
