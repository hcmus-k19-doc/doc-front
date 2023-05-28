import { Dayjs } from 'dayjs';

export interface ExpireDocDto {
  id: number;
  name: string;
  summary: string;
  dateExpired: Dayjs;
}
