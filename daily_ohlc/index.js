const puppeteer = require('puppeteer');
const Redis = require('ioredis');
const config = require('./config.json');

const logMessage = (message, publisher, file="OHLC") => {
  publisher.publish(config.REDIS.LOGGING, `${file}:${message}`);
}

const fetchData = async (tag, type, publisher, last) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    }, 
    headless: true,
    executablePath: '/usr/bin/chromium-browser',
    args: [
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
    ]
  });

  let end_date = Math.floor(new Date().getTime() / 1000), start_date;

  if(!last) {
    start_date =  Math.floor(new Date('Jan 01 2012').getTime() / 1000)
  } else {
    start_date = Math.floor(new Date(last).getTime() / 1000)
  }

  const page = await browser.newPage();
  logMessage('Launching browser and opening new page', publisher);
  const url = `https://in.investing.com/${type}/${tag}-historical-data?end_date=${end_date}&st_date=${start_date}`
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  logMessage('Opening URL', publisher);

  const list = await page.$$('table.common-table.js-table.medium tr.common-table-item.u-clickable');
  const dataList = [];

  for(let item of list) {
    const date = await page.evaluate(el => el.textContent, await item.$('td.col-rowDate span.text')) ;
    const timestamp = new Date(date);
    const year = timestamp.getFullYear();
    const open = await page.evaluate(el => el.textContent, await item.$('td.col-last_close span.text')) ;
    const close = await page.evaluate(el => el.textContent, await item.$('td.col-last_open span.text')) ;
    const high = await page.evaluate(el => el.textContent, await item.$('td.col-last_max span.text')) ;
    const low = await page.evaluate(el => el.textContent, await item.$('td.col-last_min span.text')) ;
    const volume = await page.evaluate(el => el.textContent, await item.$('td.col-volume span.text')) ;
    let changePercent = await page.evaluate(el => el.textContent, await item.$('td.col-change_percent span.text')) ;
    changePercent = changePercent.replace('%', '');
    changePercent = changePercent.replace(',', '');
    const data = {
      date,
      year,
      open: parseFloat(open.replace(',', '')),
      high: parseFloat(high.replace(',', '')),
      low: parseFloat(low.replace(',', '')),
      close: parseFloat(close.replace(',', '')),
      // volume,
      changePercent: parseFloat(changePercent)
    };
    dataList.push(data);
  }
  logMessage('Extracted data from webpage', publisher);

  await browser.close();
  logMessage('Browser closed', publisher);

  return dataList;
};


(async () => {

  const publisher = new Redis({ host: 'redis', port: 6379 });
  const subscriber = new Redis({ host: 'redis', port: 6379 });

  subscriber.subscribe(config.REDIS.INSTRUCTION)
  subscriber.on("message", async (channel, message) => {
    logMessage('Receiving instructions', publisher);
    const data = JSON.parse(message);
    if (data.instruction == 'Technical') {
      logMessage('Starting browser extraction', publisher);
      const responseData = await fetchData(data.tag, data.type, publisher);
      logMessage('Publishing extracted data', publisher);
      publisher.publish(config.REDIS.DATA, JSON.stringify({
        symbol: data.symbol,
        type: config.REDIS.DOCUMENT.OHLC,
        data: responseData
      }));
    }
  });

  // setInterval(() => {
  //   publisher.publish(config.REDIS.HEARTBEAT, (new Date()).toISOString());
  // }, 10000);
})();
