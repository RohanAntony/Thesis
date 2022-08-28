import { CreatedResponse } from "./BaseTypes";

export interface Company {
  name: string;
  symbol: string;
  ticker_tag: string;
  investing_tag: string;
}

export interface CreatedCompanyResponse {
  data: CreatedResponse,
}

export interface ListCompaniesResponse {
  data: Company[],
}