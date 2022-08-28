import * as mongoose from 'mongoose';

export const OHLCSchemaName = 'OHLC';

export const OHLCSchema = new mongoose.Schema(
  {
    _id: String,
    symbol: String,
    date: Date,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
  },
  {
    _id: false,
  },
);
