import {
  LastDateResponse,
  CreatedResponse,
  DeletedResponse,
} from './BaseTypes';

export interface Fundamental {
  symbol: string;
  year: number;
  currentAssets: number;
  nonCurrentAssets: number;
  totalAssets: number;
  currentLiabilities: number;
  nonCurrentLiabilities: number;
  totalLiabilities: number;
  totalEquity: number;
  revenue: number;
  netIncome: number;
  eps: number;
  netChangeInCash: number;
  capex: number;
  freeCashFlow: number;
}

export interface LastFundamentalDateResponse {
  data: LastDateResponse;
}

export interface ListFundamentalResponse {
  data: Fundamental[];
}

export interface CreatedFundamentalResponse {
  data: CreatedResponse;
}

// export interface DeletedFundamentalResponse {
//   data: DeletedResponse;
// }
