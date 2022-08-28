import * as mongoose from 'mongoose';

export const FundamentalSchemaName = 'Fundamental';

export const FundamentalSchema = new mongoose.Schema(
  {
    _id: String,
    symbol: String,
    year: Number,
    currentAssets: Number,
    nonCurrentAssets: Number,
    totalAssets: Number,
    currentLiabilities: Number,
    nonCurrentLiabilities: Number,
    totalLiabilities: Number,
    totalEquity: Number,
    revenue: Number,
    netIncome: Number,
    eps: Number,
    dps: Number,
    payoutRatio: Number,
    netChangeInCash: Number,
    capex: Number,
    freeCashFlow: Number,
  },
  {
    _id: false, // Use year+symbol to create ID
  },
);
