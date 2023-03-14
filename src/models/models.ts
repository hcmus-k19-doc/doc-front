export interface TokenDto {
  access_token: string;
  refresh_token?: string;
}

type PaginationState = {
  page?: number
}

type IncomingNumberState = {
  incomingNumber?: string
}

export type DocQueryState = PaginationState & IncomingNumberState
