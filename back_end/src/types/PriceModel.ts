export interface PriceModel {
  symbol: string,
  date: Date,
  // input fields for training
  price: number,
  usdinr: number,
  gold: number,
  oil: number,
  naturalgas: number,
  currentRatio: number,
  debtToEquity: number,
  eps: number,
  roa: number,
  roe: number,
  inflation: number,
  unemployment: number,
  gdpGrowth: number,
  // output fields for training 
  weeklyAverage: number,
  monthlyAverage: number,
}