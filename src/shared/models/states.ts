export interface PaginationState {
  page: number;
  pageSize: number;
}

export const PAGE_SIZE = 10;

export const PaginationStateUtils = {
  defaultValue: {
    page: 1,
    pageSize: PAGE_SIZE,
  },
};
