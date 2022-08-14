import * as mongoose from 'mongoose';

export const CompanySchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    symbol: String,
    ticker_tag: String,
    investing_tag: String,
  },
  {
    _id: false,
  },
);
