const DateValidator = {
  validateBeforeAfter: (before: any, after: any) => {
    if (before && after) {
      before = new Date(before);
      after = new Date(after);

      if (before > after) {
        return Promise.reject();
      }
    }

    return Promise.resolve();
  },
};

export default DateValidator;
