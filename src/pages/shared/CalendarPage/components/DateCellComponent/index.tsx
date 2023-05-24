import { Badge, BadgeProps } from 'antd';
import { Dayjs } from 'dayjs';
import { YEAR_MONTH_DAY_FORMAT } from 'utils/DateTimeUtils';

interface Props {
  value: Dayjs;
  data: any;
}

export default function DateCell({ value, data }: Props) {
  const date = value.format(YEAR_MONTH_DAY_FORMAT);
  return (
    <ul className='events'>
      {data?.[date]?.map((item: string) => {
        let type: string;
        switch (item) {
          case 'ACTIVE':
            type = 'success';
            break;
          case 'EXPIRED':
            type = 'error';
            break;
          default:
            type = 'warning';
        }

        return (
          <li className='flex justify-end' key={item}>
            <Badge status={type as BadgeProps['status']} />
          </li>
        );
      })}
    </ul>
  );
}
