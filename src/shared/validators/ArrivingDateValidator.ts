import { DAY_MONTH_YEAR_FORMAT } from 'utils/DateTimeUtils';

const ArrivingDateValidator = {
  validate: (value: any, distributionDate: any) => {
    if (value) {
      if (value.format(DAY_MONTH_YEAR_FORMAT) === distributionDate.format(DAY_MONTH_YEAR_FORMAT)) {
        return Promise.resolve();
      }

      if (value && value.isBefore(distributionDate)) {
        return Promise.reject();
      }

      return Promise.resolve();
    }
    return Promise.resolve();
  },
};

export default ArrivingDateValidator;
