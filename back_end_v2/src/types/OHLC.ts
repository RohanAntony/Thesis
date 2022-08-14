export interface OHLC {
  symbol: string,
  date: string,
  open: string,
  high: string,
  low: string,
  close: string,
}

export interface LastOHLCDateResponse {
  data: {
    date: string,
  }
}

export interface ListOHLCResponse {
  data: OHLC[],
}

export interface CreatedOHLCResponse{
  data: {
    created: boolean,
    count: number,
  },
}

export interface DeletedOHLCResponse{
  data: {
    deleted: boolean,
    count: number,
  }
}