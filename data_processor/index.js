const redis = require('redis');

const config = require('./config.json');

(async () => {

  const publisher = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  await publisher.connect();
  const subscriber = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  await subscriber.connect();
  
  [
    config.REDIS.ABS_CHANNEL.HEARTBEAT,
    config.REDIS.ACF_CHANNEL.HEARTBEAT,
    config.REDIS.AIS_CHANNEL.HEARTBEAT,
    config.REDIS.ABS_CHANNEL.DATA,
    config.REDIS.ACF_CHANNEL.DATA,
    config.REDIS.AIS_CHANNEL.DATA,
  ].forEach(channel => {
    subscriber.subscribe(channel, (message) => {
      console.log(`${channel}: ${message}`);
    })
  })

  setTimeout(async () => {
    publisher.publish(config.REDIS.ABS_CHANNEL.INSTRUCTION, JSON.stringify({
      tag: "bajaj-finance-BJFN",
      symbol: "BAJFINANCE",
      name: "Bajaj Finance Ltd"
    }));
  }, 11000);

  // setTimeout(async () => {
  //   publisher.publish(ANNUAL_CASH_FLOW.INSTRUCTION_CHANNEL, JSON.stringify({
  //     tag: "bajaj-finance-BJFN",
  //     symbol: "BAJFINANCE",
  //     name: "Bajaj Finance Ltd"
  //   }));
  // }, 12000);

  // setTimeout(async () => {
  //   publisher.publish(ANNUAL_INCOME_STATEMENT.INSTRUCTION_CHANNEL, JSON.stringify({
  //     tag: "bajaj-finance-BJFN",
  //     symbol: "BAJFINANCE",
  //     name: "Bajaj Finance Ltd"
  //   }));
  // }, 13000);

})();