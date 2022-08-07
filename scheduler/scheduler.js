// Scheduler file
// Reads the database and schedules data fetch operations when required
const redis = require('redis');

(async () => {

  const publisher = await redis.createClient({ socket: { host: "redis" } });;
  await publisher.connect();

  const INSTRUCTION_CHANNEL = 'Instructions';
  const DATA_CHANNEL = 'Data';

  const INSTRUCTION_SET = {
    FETCH_ANNUAL_BALANCE_SHEET: 'fetchAnnualBalanceSheet',
    FETCH_ANNUAL_CASH_FLOW: 'fetchAnnualCashFlow',
    FETCH_ANNUAL_INCOME_STATEMENT: 'fetchAnnualIncomeStatement',
    // FETCH_QUARTER_INCOME_STATEMENT: 'fetchQuarterIncomeStatement'
  }

  setTimeout(async () => {
    console.log('Publishing ' + INSTRUCTION_SET.FETCH_ANNUAL_BALANCE_SHEET);
    publisher.publish(INSTRUCTION_CHANNEL, INSTRUCTION_SET.FETCH_ANNUAL_BALANCE_SHEET);
    // {
    //   instruction: INSTRUCTION_SET.FETCH_ANNUAL_BALANCE_SHEET,
    //   data: {
    //     tag: 'RELIANCE',
    //     symbol: 'RELIANCE',
    //     name: 'Reliance Industries'
    //   }
    // }
  }, 2000);

})();