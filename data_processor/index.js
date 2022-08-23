const Redis = require('ioredis');
const config = require('./config.json');

(async () => {

  const publisher = new Redis({
    host: config.REDIS.HOSTNAME,
  });
  const subscriber = new Redis({
    host: config.REDIS.HOSTNAME,
  })

  // const publisher = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  // await publisher.connect();
  // const subscriber = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  // await subscriber.connect();

  setTimeout(() => {
    console.log(`Publishing to ${config.REDIS.LOG_CHANNEL}: test2`);
    publisher.publish(config.REDIS.LOG_CHANNEL, 'test2');
  }, 15000);

  // const data = {
  //   [config.REDIS.ABS_CHANNEL.DATA]: null,
  //   [config.REDIS.ACF_CHANNEL.DATA]: null,
  //   [config.REDIS.AIS_CHANNEL.DATA]: null,
  //   [config.REDIS.OHLC_CHANNEL.DATA]: null,
  // };
  
  // [
  //   config.REDIS.ABS_CHANNEL.DATA,
  //   config.REDIS.ACF_CHANNEL.DATA,
  //   config.REDIS.AIS_CHANNEL.DATA,
  //   config.REDIS.OHLC_CHANNEL.DATA,
  // ].forEach(channel => {
  //   subscriber.subscribe(channel, (message) => {
  //     console.log(`Received data from ${channel}`);
  //     data[channel] = JSON.parse(message);
  //   })
  // });

  // [
  //   // config.REDIS.ABS_CHANNEL.HEARTBEAT,
  //   // config.REDIS.ACF_CHANNEL.HEARTBEAT,
  //   // config.REDIS.AIS_CHANNEL.HEARTBEAT,
  //   // config.REDIS.OHLC_CHANNEL.HEARTBEAT,
  //   config.REDIS.LOG_CHANNEL,
  // ].forEach(channel => {
  //   subscriber.subscribe(channel, (message) => {
  //     console.log(`${channel}:${message}`);
  //   })
  // })

  // setTimeout(async () => {
  //   publisher.publish(config.REDIS.ABS_CHANNEL.INSTRUCTION, JSON.stringify({
  //     tag: "bajaj-finance-BJFN",
  //     symbol: "BAJFINANCE",
  //     name: "Bajaj Finance Ltd"
  //   }));
  // }, 10000);
  // setTimeout(async () => {
  //   publisher.publish(config.REDIS.ACF_CHANNEL.INSTRUCTION, JSON.stringify({
  //     tag: "bajaj-finance-BJFN",
  //     symbol: "BAJFINANCE",
  //     name: "Bajaj Finance Ltd"
  //   }));
  // }, 11000);
  // setTimeout(async () => {
  //   publisher.publish(config.REDIS.AIS_CHANNEL.INSTRUCTION, JSON.stringify({
  //     tag: "bajaj-finance-BJFN",
  //     symbol: "BAJFINANCE",
  //     name: "Bajaj Finance Ltd"
  //   }));
  // }, 12000);
  // setTimeout(async () => {
  //   publisher.publish(config.REDIS.OHLC_CHANNEL.INSTRUCTION, JSON.stringify({
  //     tag: "bajaj-finance",
  //     type: "equities"
  //   }));
  // }, 5000);

  // let handle = setInterval(() => {
  //   if(data[config.REDIS.OHLC_CHANNEL.DATA] 
  //     && data[config.REDIS.ACF_CHANNEL.DATA] 
  //     && data[config.REDIS.ABS_CHANNEL.DATA] 
  //     && data[config.REDIS.AIS_CHANNEL.DATA]
  //     ) {
  //     fs.writeFile('/myvol/sample.json', JSON.stringify(data), (err) => {
  //       if(err) {
  //         throw err;
  //       }
  //       clearInterval(handle);
  //     });
  //   }
  // }, 500);

})();