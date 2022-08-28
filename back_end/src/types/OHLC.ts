import {
  LastDateResponse,
  CreatedResponse,
  DeletedResponse,
} from './BaseTypes';

export interface OHLC {
  symbol: string;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
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
