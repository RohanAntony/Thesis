import * as mongoose from 'mongoose';

export const CompanySchemaName = 'Company';

export const CompanySchema = new mongoose.Schema(
  {
    _id: String,
    name: String,
    symbol: String,
    tickerTag: String,
    investingTag: String,
  },
  {
    _id: false,
  },
);
