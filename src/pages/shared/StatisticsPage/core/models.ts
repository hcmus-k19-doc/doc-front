export type TableRowDataType = {
  ordinalNumber: number;
  key: number;
  expertName: string;
  onTime: number;
  overdueClosedDoc: number;
  totalClosedDoc: number;
  unexpired: number;
  overdueUnprocessedDoc: number;
  totalUnprocessedDoc: number;
  onTimeProcessingPercentage: number | string;
};
