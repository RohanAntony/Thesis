const fs = require('fs');
const dfd = require('danfojs-node');

// Steps for execution
// 1. Read the data from input channels
const data = JSON.parse(fs.readFileSync('sample.json'));
console.log(data);

// 2. Parse JSON to CSV
const df_acf = new dfd.DataFrame(data.data_acf);
console.log(df_acf);
const df_abs = new dfd.DataFrame(data.data_abs);
console.log(df_abs);
const df_ais = new dfd.DataFrame(data.data_ais);
console.log(df_ais);
const df_ohlc = new dfd.DataFrame(data.data_ohlc);
console.log(df_ohlc);

// 3. Load CSV in different data frames
// 4. Merge Data frames
// 5. Augment the data for fundamentals column
// 6. Calculate and add output column values 
// 7. Standardize the inputs and outputs
// 8. Output the standardized values as well as standardization values to channels 
// 9. Build ML Model based on LSTM to predict 
// 10. Store ML Model along with standardization values if possible