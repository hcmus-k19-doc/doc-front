import { DocSystemRoleEnum, UserDto } from 'models/doc-main-models';

export const getStep = (reporter: UserDto, assignee: UserDto | null, isCreate: boolean) => {
  let step = 1;
  switch (reporter.role) {
    case DocSystemRoleEnum.VAN_THU:
      step = 1;
      break;
    case DocSystemRoleEnum.HIEU_TRUONG:
      if (isCreate) {
        step = 2;
      } else {
        step = 1;
      }
      break;
    case DocSystemRoleEnum.TRUONG_PHONG:
      if (isCreate) {
        step = 3;
      } else {
        step = 2;
      }
      break;
    case DocSystemRoleEnum.CHUYEN_VIEN:
      if (isCreate) {
        step = 4;
      } else {
        step = 3;
      }
      break;
    default:
      step = 1;
      break;
  }
  return step;
};

export const getStepOutgoingDocument = (reporter: UserDto, isCreate: boolean) => {
  let step: number;
  switch (reporter.role) {
    case DocSystemRoleEnum.CHUYEN_VIEN:
      step = 1;
      break;
    case DocSystemRoleEnum.TRUONG_PHONG:
      if (isCreate) {
        step = 2;
      } else {
        step = 1;
      }
      break;
    case DocSystemRoleEnum.HIEU_TRUONG:
      if (isCreate) {
        step = 3;
      } else {
        step = 2;
      }
      break;
    case DocSystemRoleEnum.VAN_THU:
      step = 3;
      break;
    default:
      step = 1;
      break;
  }
  return step;
};
