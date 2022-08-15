import * as mongoose from 'mongoose';

export const MacroeconomicSchemaName = 'Macroeconomic';

export const MacroeconomicSchema = new mongoose.Schema(
  {
    _id: String,
    year: Number,
    type: String,
    value: Number
  },
  {
    _id: false,
  },
);
