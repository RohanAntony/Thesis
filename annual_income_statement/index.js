const puppeteer = require('puppeteer');
const Redis = require('ioredis');
const config = require('./config.json');

const logMessage = (message, publisher, file="AIS") => {
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
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=income&view=normal`
  await page.goto(url, {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  logMessage('Opening URL', publisher);

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

      // "currentAssets": 11,000,
  // "nonCurrentAssets": 110,000,
  // "totalAssets": 121,000,
  // "currentLiabilities": 5,000,
  // "nonCurrentLiabilities": 17,000,
  // "totalLiabilities": 22000,
  // "totalEquity": 95000,
  // "revenue": 130000,
  // "netIncome": 11000,
  // "eps": 90,
  // "netChangeInCash": -14000,
  // "capex": 16000,
  // "freeCashFlow": 10000,

  const rowClasses = [
    { class: ".period-text span", name: 'period', post: (data) => parseInt(data.slice(3,7)) },
    { class: "td[data-row='incTrev'] .value-cell-content", name: 'revenue', post: (data) => parseFloat(data.replace(',', '')) },
    // { class: "td[data-row='incRaw'] .value-cell-content", name: 'rawMaterials'},
    // { class: "td[data-row='incPfc'] .value-cell-content", name: 'powerAndFuelCost'},
    // { class: "td[data-row='incEpc'] .value-cell-content", name: 'employeeCost'},
    // { class: "td[data-row='incSga'] .value-cell-content", name: 'salesAndAdminExpenses'},
    // { class: "td[data-row='incOpe'] .value-cell-content", name: 'operationsAndOtherExpenses'},
    // { class: "td[data-row='incEbi'] .value-cell-content", name: 'ebitda'},
    // { class: "td[data-row='incDep'] .value-cell-content", name: 'depreciationAndAmortization'},
    // { class: "td[data-row='incPbi'] .value-cell-content", name: 'pbit'},
    // { class: "td[data-row='incIoi'] .value-cell-content", name: 'interestAndOtherItems'},
    // { class: "td[data-row='incPbt'] .value-cell-content", name: 'pbt'},
    // { class: "td[data-row='incToi'] .value-cell-content", name: 'taxesAndOtherItems'},
    { class: "td[data-row='incNinc'] .value-cell-content", name: 'netIncome', post: (data) => parseFloat(data.replace(',', '')) },
    { class: "td[data-row='incEps'] .value-cell-content", name: 'eps', post: (data) => parseFloat(data.replace(',', '')) },
    { class: "td[data-row='incDps'] .value-cell-content", name: 'dps', post: (data) => parseFloat(data.replace(',', '')) },
    { class: "td[data-row='incPyr'] .value-cell-content", name: 'payoutRatio', post: (data) => parseFloat(data.replace(',', '')) },
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
      let tempDatum = rowBasedData[rowClass.name][index];
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
        type: config.REDIS.DOCUMENT.AIS,
        data: responseData
      }));
    }
  });

  // setInterval(() => {
  //   publisher.publish(config.REDIS.HEARTBEAT, (new Date()).toISOString());
  // }, 10000);
})();