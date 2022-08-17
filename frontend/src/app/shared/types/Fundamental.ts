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
