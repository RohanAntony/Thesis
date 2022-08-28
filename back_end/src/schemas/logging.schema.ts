import * as mongoose from 'mongoose';

export const LoggingSchemaName = 'Log';

export const LoggingSchema = new mongoose.Schema({
  timestamp: Date,
  process: String,
  log: String,
});
