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
  dps: number;
  payoutRatio: number;
  netChangeInCash: number;
  capex: number;
  freeCashFlow: number;
}

export enum FundamentalKeys {
  SYMBOL="symbol",
  YEAR="year",
  CURRENT_ASSETS="currentAssets",
  NON_CURRENT_ASSETS="nonCurrentAssets",
  TOTAL_ASSETS="totalAssets",
  CURRENT_LIABILITIES="currentLiabilities",
  NON_CURRENT_LIABILITIES="nonCurrentLiabilities",
  TOTAL_LIABILITIES="totalLiabilities",
  TOTAL_EQUITY="totalEquity",
  REVENUE="revenue",
  NET_INCOME="netIncome",
  EPS="eps",
  DPS="dps",
  PAYOUT_RATIO="payoutRatio",
  NET_CHANGE_IN_CASH="netChangeInCash",
  CAPEX="capex",
  FREE_CASH_FLOW="freeCashFlow",
}

export const FUNDAMENTAL_KEY_OPTIONS = [{
  name: "Current Assets", value: FundamentalKeys.CURRENT_ASSETS
},{
  name: "Non Current Assets", value: FundamentalKeys.NON_CURRENT_ASSETS
},{
  name: "Total Assets", value: FundamentalKeys.TOTAL_ASSETS
},{
  name: "Current Liabilities", value: FundamentalKeys.CURRENT_LIABILITIES
},{
  name: "Non Current Liabilities", value: FundamentalKeys.NON_CURRENT_LIABILITIES
},{
  name: "Total Liabilities", value: FundamentalKeys.TOTAL_LIABILITIES
},{
  name: "Total Equity", value: FundamentalKeys.TOTAL_EQUITY
},{
  name: "Revenue", value: FundamentalKeys.REVENUE
},{
  name: "Net Income", value: FundamentalKeys.NET_INCOME
},{
  name: "Earnings Per Share", value: FundamentalKeys.EPS
},{
  name: "Dividend Per Share", value: FundamentalKeys.DPS
},{
  name: "Payout Ratio", value: FundamentalKeys.PAYOUT_RATIO
},{
  name: "Net Change in Cash", value: FundamentalKeys.NET_CHANGE_IN_CASH
},{
  name: "Capital Expenditures", value: FundamentalKeys.CAPEX
},{
  name: "Free Cash Flow", value: FundamentalKeys.FREE_CASH_FLOW
}]
