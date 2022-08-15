export enum MacroeconomicType {
  INFLATION = 'Inflation',
  UNEMPLOYMENT = 'Unemployment',
  GDP = 'GDP',
}

export interface Macroeconomic {
  year: number,
  type: MacroeconomicType,
  value: number
}
