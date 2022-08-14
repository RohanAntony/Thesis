const {Builder} = require("selenium-webdriver");
const {Options} = require('selenium-webdriver/chrome');

const fetchData = async (date) => { 

  // Wait 20s before trying to connect with selenium instance
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20000);
  const options = new Options();
  options.addArguments("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36");
  let driver = await new Builder().forBrowser("chrome").setChromeOptions(options).usingServer('http://selenium_instance:4444/wd/hub').build();  
  await driver.get("https://www1.nseindia.com/products/content/equities/equities/archieve_eq.htm");
  var title = await driver.getTitle();
  console.log('Title is:',title);
  await driver.quit();
};

// (async () => {

//   const publisher = await redis.createClient({ socket: { host: "redis" } });;
//   await publisher.connect();
//   const subscriber = await redis.createClient({ socket: { host: "redis" } });;
//   await subscriber.connect();

//   const DAILY_OHLC = {
//     INSTRUCTION_CHANNEL: 'instruction_daily_ohlc',
//     DATA_CHANNEL: 'data_daily_ohlc',
//     HEARTBEAT_CHANNEL: 'heatbeat_daily_ohlc'
//   }

//   await subscriber.subscribe(DAILY_OHLC.INSTRUCTION_CHANNEL, async (message) => {
//     const data = JSON.parse(message);
//     const responseData = await fetchData(data.tag, data.symbol, data.name);
//     responseData.forEach(res => {
//       publisher.publish(DAILY_OHLC.DATA_CHANNEL, JSON.stringify(res));
//     });
//   });

//   setInterval(() => {
//     publisher.publish(DAILY_OHLC.HEARTBEAT_CHANNEL, (new Date()).toISOString());
//   }, 10000);
// })();

(async () => {
  await fetchData();
})();