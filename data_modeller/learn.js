const fs = require('fs');
const dfd = require('danfojs-node');

const data = JSON.parse(fs.readFileSync('sample.json'));
const range = 0.05;

let df_abs = new dfd.DataFrame(data.data_abs);
let df_acf = new dfd.DataFrame(data.data_acf);
let df_ais = new dfd.DataFrame(data.data_ais);
let df_ohlc = new dfd.DataFrame(data.data_ohlc);
df_ohlc.rename({ 'year': 'period' }, { inplace: true });

let fundamentals = dfd.merge({
  left: df_abs,
  right: df_acf,
  on: ['period', 'symbol'],
  how: 'outer'
});
fundamentals = dfd.merge({
  left: fundamentals,
  right: df_ais,
  on: ['period', 'symbol'],
  how: 'outer'
});
const mergedData = dfd.merge({
  left: fundamentals,
  right: df_ohlc,
  on: ['period'],
  how: 'left'
});
mergedData.setIndex({ column: 'timestamp', inplace: true });

// Drop unwanted columns
const trainData = mergedData.drop({ columns: ['period', 'symbol', 'date', 'totalAssets', 'totalLiabilities', 'totalEquity'] });

// Augment the data for fundamentals column
trainData['currentAssets'] = trainData['currentAssets'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['nonCurrentAssets'] = trainData['nonCurrentAssets'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['currentLiabilities'] = trainData['currentLiabilities'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['nonCurrentLiabilities'] = trainData['nonCurrentLiabilities'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['netChangeInCash'] = trainData['netChangeInCash'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['capex'] = trainData['capex'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['freeCashFlow'] = trainData['freeCashFlow'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['revenue'] = trainData['revenue'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['netIncome'] = trainData['netIncome'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['eps'] = trainData['eps'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['dps'] = trainData['dps'].map((d) => (d - (Math.random() - 0.5) * range * d) )
trainData['payoutRatio'] = trainData['payoutRatio'].map((d) => (d - (Math.random() - 0.5) * range * d) )

// Calculate and add output column values 

// Standardize the inputs and outputs


// 8. Output the standardized values as well as standardization values to channels 
// 9. Build ML Model based on LSTM to predict 
// 10. Store ML Model along with standardization values if possible