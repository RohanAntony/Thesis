const puppeteer = require('puppeteer');
const redis = require('redis');

// const config = require('./config.json');

const fetchData = async (tag, type, last) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    }, 
    headless: false,
    // executablePath: '/usr/bin/chromium-browser',
    // args: [
    //   "--disable-gpu",
    //   "--no-sandbox",
    //   "--disable-dev-shm-usage",
    //   "--disable-setuid-sandbox",
    // ]
  });

  let end_date = Math.floor(new Date().getTime() / 1000), start_date;

  if(!last) {
    start_date =  Math.floor(new Date('Jan 01 2022').getTime() / 1000)
  } else {
    start_date = Math.floor(new Date(last).getTime() / 1000)
  }

  const page = await browser.newPage();
  const url = `https://in.investing.com/${type}/${tag}-historical-data?end_date=${end_date}&st_date=${start_date}`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  const list = await page.$$('table.common-table.js-table.medium tr.common-table-item.u-clickable');
  const dataList = [];

  for(let item of list) {
    const date = await page.evaluate(el => el.textContent, await item.$('td.col-rowDate span.text')) ;
    const open = await page.evaluate(el => el.textContent, await item.$('td.col-last_close span.text')) ;
    const close = await page.evaluate(el => el.textContent, await item.$('td.col-last_open span.text')) ;
    const high = await page.evaluate(el => el.textContent, await item.$('td.col-last_max span.text')) ;
    const low = await page.evaluate(el => el.textContent, await item.$('td.col-last_min span.text')) ;
    const volume = await page.evaluate(el => el.textContent, await item.$('td.col-volume span.text')) ;
    const changePercent = await page.evaluate(el => el.textContent, await item.$('td.col-change_percent span.text')) ;
    const data = {
      date,
      timestamp: new Date(date).toISOString(), 
      open,
      high,
      low,
      close,
      volume,
      changePercent
    };
    dataList.push(data);
  }

  await browser.close();

  return dataList;
};


(async () => {

//   await fetchData("usd-inr-futures", "currencies");
//   await fetchData("bajaj-finance", "equities");

  const publisher = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  await publisher.connect();
  const subscriber = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  await subscriber.connect();

  await subscriber.subscribe(config.REDIS.OHLC_CHANNEL.INSTRUCTION, async (message) => {
    const data = JSON.parse(message);
    const responseData = await fetchData(data.tag, data.type);
    publisher.publish(config.REDIS.OHLC_CHANNEL.DATA, JSON.stringify(responseData));
  });

  setInterval(() => {
    publisher.publish(config.REDIS.OHLC_CHANNEL.HEARTBEAT, (new Date()).toISOString());
  }, 10000);
})();
