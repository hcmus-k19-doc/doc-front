export const DAY_MONTH_YEAR_FORMAT = 'DD-MM-YYYY';
export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy';
export const DAY_MONTH_YEAR_FORMAT_2 = 'dd-MM-yyyy';
export const HH_MM_SS_FORMAT = 'HH:mm:ss';
export const YEAR_MONTH_FORMAT = 'YYYY-MM';
export const YEAR_MONTH_DAY_FORMAT = 'YYYY-MM-DD';

export function getCurrentQuarter() {
  const currentDate = new Date();
  return `${Math.ceil((currentDate.getMonth() + 1) / 3)}/${currentDate.getFullYear()}`;
}
