import * as mongoose from 'mongoose';

export const FundamentalSchemaName = 'Fundamental';

export const FundamentalSchema = new mongoose.Schema(
  {
    _id: String,
    symbol: String,
    year: Number,
    currentAssets: Number,
    nonCurrentAssets: Number,
    currentLiabilities: Number,
    nonCurrentLiabilities: Number,
    totalShareholdersEquity: Number,
    eps: Number,
    dps: Number,
    netIncome: Number,
    cashOperatingActivities: Number,
    capex: Number,
    freeCashFlow: Number,
  },
  {
    _id: false, // Use year+symbol to create ID
  },
);
