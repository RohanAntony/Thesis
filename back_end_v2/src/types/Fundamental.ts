import {
  LastDateResponse,
  CreatedResponse,
  DeletedResponse,
} from './BaseTypes';

export interface Fundamental {
  symbol: string;
  year: number;
  netIncome: number;
  equity: number;
  totalAssets: number;
  currentAssets: number;
  currentLiabilities: number;
  totalLiabilities: number;
  eps: number;
  // Add required fundamentals that need to be saved
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
