const puppeteer = require('puppeteer');
const Redis = require('ioredis');
const config = require('./config.json');

const logMessage = (message, publisher, file="ACF") => {
  publisher.publish(config.REDIS.LOGGING, `${file}:${message}`);
}

const fetchData = async (tickertag, symbol, name, publisher) => {
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
  const page = await browser.newPage();
  logMessage('Launching browser and opening new page', publisher);
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=cashflow`
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  logMessage('Opening URL', publisher);

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  const rowClasses = [
    { class: ".period-text span", name: 'period', post: (data) => parseInt(data.slice(3,7)) },
    // { class: "td[data-row='cafCfoa'] .value-cell-content", name: 'cashFromOperatingActivities'},
    // { class: "td[data-row='cafCfia'] .value-cell-content", name: 'cashFromInvestingActivities'},
    // { class: "td[data-row='cafCffa'] .value-cell-content", name: 'cashFromFinancingActivities'},
    { class: "td[data-row='cafNcic'] .value-cell-content", name: 'netChangeInCash', post: (data) => parseFloat(data.replace(',', '')) },
    // { class: "td[data-row='cafCiwc'] .value-cell-content", name: 'changesInWorkingCapital'},
    { class: "td[data-row='cafCexp'] .value-cell-content", name: 'capex', post: (data) => parseFloat(data.replace(',', '')) },
    { class: "td[data-row='cafFcf'] .value-cell-content", name: 'freeCashFlow', post: (data) => parseFloat(data.replace(',', '')) },
  ];

  const rowBasedData = {};
  for(const rowClass of rowClasses) {
    rowBasedData[rowClass.name] = [];
    const rowData = await page.$$(rowClass.class)
    for(const cellData of rowData) {
      rowBasedData[rowClass.name].push(await page.evaluate(el => el.textContent, cellData))
    } 
  }
  logMessage('Extracted data from webpage', publisher);

  const periodData = [];
  const length = rowBasedData['period'].length;
  for(let index = 0; index < length; index = index + 1){
    const singlePeriodData = {
      symbol,
    };
    for(const rowClass of rowClasses) {
      let tempDatum = rowBasedData[rowClass.name][index]
      singlePeriodData[rowClass.name] = rowClass.post(tempDatum);
    }
    periodData.push(singlePeriodData);
  }
  logMessage('Processed data into JSON object', publisher);

  await browser.close();
  logMessage('Browser closed', publisher);

  return periodData;
};

(async () => {

  const publisher = new Redis({ host: 'redis', port: 6379 });
  const subscriber = new Redis({ host: 'redis', port: 6379 });

  subscriber.subscribe(config.REDIS.INSTRUCTION)
  subscriber.on("message", async (channel, message) => {
    logMessage('Receiving instructions', publisher);
    const data = JSON.parse(message);
    if(data.instruction == 'Fundamental') {
      logMessage('Starting browser extraction', publisher);
      const responseData = await fetchData(data.tag, data.symbol, data.name, publisher);
      logMessage('Publishing extracted data', publisher);
      publisher.publish(config.REDIS.DATA, JSON.stringify({
        symbol: data.symbol,
        type: config.REDIS.DOCUMENT.ACF,
        data: responseData
      }));
    }
  });

  // setInterval(() => {
  //   publisher.publish(config.REDIS.HEARTBEAT, (new Date()).toISOString());
  // }, 10000);
})();
