import { FormInstance, Rule } from 'antd/es/form';
import dayjs, { Dayjs } from 'dayjs';
import { t } from 'i18next';

function NoneBlankValidator(message: string): Rule {
  return {
    required: true,
    whitespace: true,
    message,
    validator: (_, value: string) =>
      value && value.trim().length > 0 ? Promise.resolve() : Promise.reject(new Error(message)),
  };
}

function NoneWhiteSpaceValidator(message: string): Rule {
  return {
    required: true,
    whitespace: true,
    message,
    validator: (_, value: string) =>
      !value.includes(' ') ? Promise.resolve() : Promise.reject(new Error(message)),
  };
}

function NoneBlankOrWhiteSpaceValidator(message: string): Rule {
  return {
    required: true,
    whitespace: true,
    message,
    validator: (_, value: string) =>
      value && value.trim().length > 0 && !value.includes(' ')
        ? Promise.resolve()
        : Promise.reject(new Error(message)),
  };
}

function FutureOrPresentDateValidator(message?: string): Rule {
  return {
    required: true,
    validator: (_, value: Dayjs) => {
      if (value) {
        const now = dayjs();
        if (value.isAfter(now) || value.isSame(now, 'day')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(message ?? 'common.error.date.must_be_future'));
      }
      return Promise.resolve();
    },
  };
}

function FutureDateValidator(message?: string): Rule {
  return {
    required: true,
    validator: (_, value: Dayjs) => {
      if (value) {
        const now = dayjs();
        if (value.isAfter(now)) {
          return Promise.resolve();
        }
        return Promise.reject(new Error(message ?? 'common.error.date.must_be_future'));
      }
      return Promise.resolve();
    },
  };
}

function PasswordValidators(message?: string): Rule[] {
  return [
    NoneBlankOrWhiteSpaceValidator(`${t('user.password.required')}`),
    {
      min: 6,
      max: 20,
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: message ?? `${t('user.password.invalid')}`,
    },
  ];
}

function addFilesFieldError(form: FormInstance<any>, ...message: string[]) {
  form.setFields([
    {
      name: 'files',
      errors: message,
    },
  ]);
}

const DocFormValidators = {
  NoneBlankValidator,
  NoneWhiteSpaceValidator,
  NoneBlankOrWhiteSpaceValidator,
  FutureOrPresentDateValidator,
  FutureDateValidator,
  PasswordValidators,
  addFilesFieldError,
};

export default DocFormValidators;
