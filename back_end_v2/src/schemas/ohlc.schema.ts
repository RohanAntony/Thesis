import * as mongoose from 'mongoose';

export const ohlcSchema = new mongoose.Schema(
  {
    _id: String,
    symbol: String,
    date: Date,
    open: String,
    high: String,
    low: String,
    close: String,
  },
  {
    _id: false,
  },
);
