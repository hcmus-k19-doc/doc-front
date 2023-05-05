import { DocSystemRoleEnum } from "./doc-main-models";

export interface TokenDto {
  access_token: string;
  refresh_token?: string;
}

export const ALL_SYSTEM_ROLES = [
  DocSystemRoleEnum.GIAM_DOC,
  DocSystemRoleEnum.CHUYEN_VIEN,
  DocSystemRoleEnum.TRUONG_PHONG,
  DocSystemRoleEnum.VAN_THU,
  DocSystemRoleEnum.DOC_ADMIN
];
