import * as mongoose from 'mongoose';

export const PriceModelSchema = new mongoose.Schema(
  {
    _id: String,
    symbol: String,
    date: Date,
    price: Number,
    usdinr: Number,
    gold: Number,
    oil: Number,
    naturalgas: Number,
    currentRatio: Number,
    debtToEquity: Number,
    eps: Number,
    roa: Number,
    roe: Number,
    inflation: Number,
    unemployment: Number,
    gdpGrowth: Number,
    weeklyAverage: Number,
    monthlyAverage: Number,
  },
  {
    _id: false,
  },
);
