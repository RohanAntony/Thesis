const puppeteer = require('puppeteer');
const Redis = require('ioredis');
const config = require('./config.json');

const logMessage = (message, publisher, file="ABS") => {
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
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=balancesheet&view=normal`
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
    // { class: "tr[data-row='balCsti'] .value-cell-content", name: 'cashAndShortTermInvestments'},
    // { class: "tr[data-row='balTrec'] .value-cell-content", name: 'totalReceivables'},
    // { class: "tr[data-row='balTinv'] .value-cell-content", name: 'totalInventory'},
    // { class: "tr[data-row='balOca'] .value-cell-content", name: 'otherCurrentAssets'},
    { class: "tr[data-row='balCa'] .value-cell-content", name: 'currentAssets', post: (data) => parseFloat(data.replace(',', '')) },
    // { class: "tr[data-row='balNetl'] .value-cell-content", name: 'loansAndAdvances'},
    // { class: "tr[data-row='balNppe'] .value-cell-content", name: 'netPropertyPlantEquipment'},
    // { class: "tr[data-row='balGint'] .value-cell-content", name: 'goodwillAndIntangibles'},
    // { class: "tr[data-row='balLti'] .value-cell-content", name: 'longTermInvestments'},
    // { class: "tr[data-row='balDta'] .value-cell-content", name: 'deferredTaxAssets'},
    // { class: "tr[data-row='balOtha'] .value-cell-content", name: 'otherAssets'},
    { class: "tr[data-row='balNca'] .value-cell-content", name: 'nonCurrentAssets', post: (data) => parseFloat(data.replace(',', ''))},
    { class: "tr[data-row='balTota'] .value-cell-content", name: 'totalAssets', post: (data) => parseFloat(data.replace(',', ''))},
    // { class: "tr[data-row='balAccp'] .value-cell-content", name: 'accountsPayable'},
    // { class: "tr[data-row='balTdep'] .value-cell-content", name: 'totalDeposits'},
    // { class: "tr[data-row='balOcl'] .value-cell-content", name: 'otherCurrentLiabilities'},
    { class: "tr[data-row='balTcl'] .value-cell-content", name: 'currentLiabilities', post: (data) => parseFloat(data.replace(',', ''))},
    // { class: "tr[data-row='balTltd'] .value-cell-content", name: 'totalLongTermDebt'},
    // { class: "tr[data-row='balDit'] .value-cell-content", name: 'deferredTaxLiabilities'},
    // { class: "tr[data-row='balOthl'] .value-cell-content", name: 'otherLiabilities'},
    { class: "tr[data-row='balNcl'] .value-cell-content", name: 'nonCurrentLiabilities', post: (data) => parseFloat(data.replace(',', ''))},
    { class: "tr[data-row='balTotl'] .value-cell-content", name: 'totalLiabilities', post: (data) => parseFloat(data.replace(',', ''))},
    // { class: "tr[data-row='balComs'] .value-cell-content", name: 'commonStock'},
    // { class: "tr[data-row='balApic'] .value-cell-content", name: 'additionalPaidInCapital'},
    // { class: "tr[data-row='balRtne'] .value-cell-content", name: 'revenueAndSurplus'},
    // { class: "tr[data-row='balMint'] .value-cell-content", name: 'minorityInterest'},
    // { class: "tr[data-row='balOeq'] .value-cell-content", name: 'otherEquity'},
    { class: "tr[data-row='balTeq'] .value-cell-content", name: 'totalEquity', post: (data) => parseFloat(data.replace(',', ''))},
    // { class: "tr[data-row='balTlse'] .value-cell-content", name: 'totalLiabilityAndShareholdersEquity'},
    // { class: "tr[data-row='balTcso'] .value-cell-content", name: 'totalCommonSharesOutstanding'},
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

  for(let period of periodData) {

  }

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
        type: config.REDIS.DOCUMENT.ABS,
        data: responseData
      }));
    }
  });

  // setInterval(() => {
  //   publisher.publish(config.REDIS.HEARTBEAT, (new Date()).toISOString());
  // }, 10000);
})();
