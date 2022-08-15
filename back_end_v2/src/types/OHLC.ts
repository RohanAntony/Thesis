import {
  LastDateResponse,
  CreatedResponse,
  DeletedResponse,
} from './BaseTypes';

export interface OHLC {
  symbol: string;
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
}

export interface LastOHLCDateResponse {
  data: LastDateResponse;
}

export interface ListOHLCResponse {
  data: OHLC[];
}

export interface CreatedOHLCResponse {
  data: CreatedResponse;
}

export interface DeletedOHLCResponse {
  data: DeletedResponse;
}
