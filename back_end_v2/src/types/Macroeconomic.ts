import { LastDateResponse, ModifiedResponse } from './BaseTypes';

export enum MacroeconomicType {
  INFLATION = 'Inflation',
  UNEMPLOYMENT = 'Unemployment',
  GDP = 'GDP',
}

export interface Macroeconomic {
  year: number;
  type: MacroeconomicType;
  value: number;
}

export interface LastMacroeconomicYearResponse {
  data: LastDateResponse;
}

export interface ListMacroeconomicResponse {
  data: Macroeconomic[];
}

export interface ModifiedMacroeconomicResponse {
  data: ModifiedResponse;
}
