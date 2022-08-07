const redis = require('redis');

(async () => {

  const publisher = await redis.createClient({ socket: { host: "redis" } });;
  await publisher.connect();
  const subscriber = await redis.createClient({ socket: { host: "redis" } });;
  await subscriber.connect();

  const ANNUAL_BALANCE_SHEET = {
    INSTRUCTION_CHANNEL: 'instruction_annual_balance_sheet',
    DATA_CHANNEL: 'data_annual_balance_sheet',
    HEARTBEAT_CHANNEL: 'heartbeat_annual_balance_sheet'
  };

  const ANNUAL_CASH_FLOW = {
    INSTRUCTION_CHANNEL: 'instruction_annual_cash_flow',
    DATA_CHANNEL: 'data_annual_cash_flow',
    HEARTBEAT_CHANNEL: 'heartbeat_annual_cash_flow'
  };

  const ANNUAL_INCOME_STATEMENT = {
    INSTRUCTION_CHANNEL: 'instruction_annual_income_statement',
    DATA_CHANNEL: 'data_annual_income_statement',
    HEARTBEAT_CHANNEL: 'heartbeat_annual_income_statement'
  };

  [
    ANNUAL_BALANCE_SHEET.DATA_CHANNEL,
    ANNUAL_CASH_FLOW.DATA_CHANNEL,
    ANNUAL_INCOME_STATEMENT.DATA_CHANNEL,
    ANNUAL_BALANCE_SHEET.HEARTBEAT_CHANNEL,
    ANNUAL_CASH_FLOW.HEARTBEAT_CHANNEL,
    ANNUAL_INCOME_STATEMENT.HEARTBEAT_CHANNEL
  ].forEach(channel => {
    subscriber.subscribe(channel, (message) => {
      console.log(message);
    })
  })

  setTimeout(async () => {
    publisher.publish(ANNUAL_BALANCE_SHEET.INSTRUCTION_CHANNEL, JSON.stringify({
      tag: "bajaj-finance-BJFN",
      symbol: "BAJFINANCE",
      name: "Bajaj Finance Ltd"
    }));
  }, 11000);

  setTimeout(async () => {
    publisher.publish(ANNUAL_CASH_FLOW.INSTRUCTION_CHANNEL, JSON.stringify({
      tag: "bajaj-finance-BJFN",
      symbol: "BAJFINANCE",
      name: "Bajaj Finance Ltd"
    }));
  }, 12000);

  setTimeout(async () => {
    publisher.publish(ANNUAL_INCOME_STATEMENT.INSTRUCTION_CHANNEL, JSON.stringify({
      tag: "bajaj-finance-BJFN",
      symbol: "BAJFINANCE",
      name: "Bajaj Finance Ltd"
    }));
  }, 13000);

})();