import * as mongoose from 'mongoose';

export const fundamentalSchema = new mongoose.Schema(
  {
    _id: String,
    symbol: String,
    year: String,
  },
  {
    _id: false,
  },
);
