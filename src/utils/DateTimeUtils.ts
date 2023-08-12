import dayjs, { Dayjs } from 'dayjs';

export const DAY_MONTH_YEAR_FORMAT = 'DD-MM-YYYY';
export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy';
export const DAY_MONTH_YEAR_FORMAT_2 = 'dd-MM-yyyy';
export const HH_MM_SS_FORMAT = 'HH:mm:ss';
export const YEAR_MONTH_FORMAT = 'YYYY-MM';
export const YEAR_MONTH_DAY_FORMAT = 'YYYY-MM-DD';
export const DAY_MONTH_YEAR_FORMAT_3 = 'DD/MM/YYYY';

export function getCurrentQuarter() {
  const currentDate = new Date();
  return `${Math.ceil((currentDate.getMonth() + 1) / 3)}/${currentDate.getFullYear()}`;
}

export function isValidDateFormat(dateString: string) {
  // Regular expression for "DD/MM/YYYY" format = DAY_MONTH_YEAR_FORMAT_3
  const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;

  // Test if the dateString matches the "DD/MM/YYYY" format
  return datePattern.test(dateString);
}

export function formatDateToDDMMYYYY(date: dayjs.Dayjs) {
  return date?.format(DAY_MONTH_YEAR_FORMAT_3);
}

export function isFutureOrPresent(date: Dayjs | string) {
  const now = dayjs();
  const dateToBeChecked = dayjs(date);
  return dateToBeChecked.isAfter(now) || dateToBeChecked.isSame(now, 'day');
}
