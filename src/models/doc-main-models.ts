/* tslint:disable */
/* eslint-disable */
// Generated using typescript-generator version 3.1.1185 on 2023-03-13 22:46:49.

export interface UserDto {
    id: number;
    username: string;
    email: string;
    roles: DocSystemRoleEnum[];
}

export const enum DocSystemRoleEnum {
    DIRECTOR = "DIRECTOR",  //LanhDao
    EXPERT = "EXPERT", //ChuyenVien
    MANAGER = "MANAGER", //PhongBan
    STAFF = "STAFF", //VanThu
}