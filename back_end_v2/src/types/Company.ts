export interface Company {
  name: string;
  symbol: string;
  ticker_tag: string;
  investing_tag: string;
}

export interface CreateCompanyResponse {
  data: {
    created: true,
  },
}

export interface ListCompaniesResponse {
  data: Company[],
}