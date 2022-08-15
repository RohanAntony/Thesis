import {
  CreatedResponse,
  LastDateResponse,
  UpdatedResponse,
} from './BaseTypes';

export interface Macroeconomic {
  year: number,
  inflation: number,
  unemployment: number,
  gdpGrowth: number,
}

export interface LastMacroeconomicYearResponse {
  data: LastDateResponse;
}

export interface ListMacroeconomicResponse {
  data: Macroeconomic[];
}

export interface CreatedMacroeconomicResponse {
  data: CreatedResponse;
}

export interface UpdatedMacroeconomicResponse {
  data: UpdatedResponse;
}