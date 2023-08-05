import { Rule } from 'antd/es/form';
import dayjs, { Dayjs } from 'dayjs';

function CommonValidator(message: string): Rule {
  return {
    required: true,
    whitespace: true,
    message,
    validator: (_, value: string) =>
      value && value.trim().length > 0 ? Promise.resolve() : Promise.reject(new Error(message)),
  };
}

function NoneBlankValidator(message: string): Rule {
  return {
    required: true,
    whitespace: true,
    message,
    validator: (_, value: string) =>
      !value.includes(' ') ? Promise.resolve() : Promise.reject(new Error(message)),
  };
}

function FutureOrPresentDateValidator(): Rule {
  return {
    required: true,
    validator: (_, value: Dayjs) => {
      if (value) {
        const now = dayjs();
        if (value.isAfter(now) || value.isSame(now, 'day')) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('common.error.date.must_be_future'));
      }
      return Promise.resolve();
    },
  };
}

const DocFormValidators = {
  CommonValidator,
  NoneBlankValidator,
  FutureOrPresentDateValidator,
};

export default DocFormValidators;
