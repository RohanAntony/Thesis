const puppeteer = require('puppeteer');
const redis = require('redis');

const fetchData = async (tickertag, symbol, name) => {
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
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=balancesheet&view=normal`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  const rowClasses = [
    { class: ".period-text span", name: 'period'},
    { class: "tr[data-row='balCsti'] .value-cell-content", name: 'cashAndShortTermInvestments'},
    { class: "tr[data-row='balTrec'] .value-cell-content", name: 'totalReceivables'},
    { class: "tr[data-row='balTinv'] .value-cell-content", name: 'totalInventory'},
    { class: "tr[data-row='balOca'] .value-cell-content", name: 'otherCurrentAssets'},
    { class: "tr[data-row='balCa'] .value-cell-content", name: 'currentAssets'},
    { class: "tr[data-row='balNetl'] .value-cell-content", name: 'loansAndAdvances'},
    { class: "tr[data-row='balNppe'] .value-cell-content", name: 'netPropertyPlantEquipment'},
    { class: "tr[data-row='balGint'] .value-cell-content", name: 'goodwillAndIntangibles'},
    { class: "tr[data-row='balLti'] .value-cell-content", name: 'longTermInvestments'},
    { class: "tr[data-row='balDta'] .value-cell-content", name: 'deferredTaxAssets'},
    { class: "tr[data-row='balOtha'] .value-cell-content", name: 'otherAssets'},
    { class: "tr[data-row='balNca'] .value-cell-content", name: 'nonCurrentAssets'},
    { class: "tr[data-row='balTota'] .value-cell-content", name: 'totalAssets'},
    { class: "tr[data-row='balAccp'] .value-cell-content", name: 'accountsPayable'},
    { class: "tr[data-row='balTdep'] .value-cell-content", name: 'totalDeposits'},
    { class: "tr[data-row='balOcl'] .value-cell-content", name: 'otherCurrentLiabilities'},
    { class: "tr[data-row='balTcl'] .value-cell-content", name: 'currentLiabilities'},
    { class: "tr[data-row='balTltd'] .value-cell-content", name: 'totalLongTermDebt'},
    { class: "tr[data-row='balDit'] .value-cell-content", name: 'deferredTaxLiabilities'},
    { class: "tr[data-row='balOthl'] .value-cell-content", name: 'otherLiabilities'},
    { class: "tr[data-row='balNcl'] .value-cell-content", name: 'nonCurrentLiabilities'},
    { class: "tr[data-row='balTotl'] .value-cell-content", name: 'totalLiabilities'},
    { class: "tr[data-row='balComs'] .value-cell-content", name: 'commonStock'},
    { class: "tr[data-row='balApic'] .value-cell-content", name: 'additionalPaidInCapital'},
    { class: "tr[data-row='balRtne'] .value-cell-content", name: 'revenueAndSurplus'},
    { class: "tr[data-row='balMint'] .value-cell-content", name: 'minorityInterest'},
    { class: "tr[data-row='balOeq'] .value-cell-content", name: 'otherEquity'},
    { class: "tr[data-row='balTeq'] .value-cell-content", name: 'totalEquity'},
    { class: "tr[data-row='balTlse'] .value-cell-content", name: 'totalLiabilityAndShareholdersEquity'},
    { class: "tr[data-row='balTcso'] .value-cell-content", name: 'totalCommonSharesOutstanding'},
  ];

  const rowBasedData = {};
  for(const rowClass of rowClasses) {
    rowBasedData[rowClass.name] = [];
    const rowData = await page.$$(rowClass.class)
    for(const cellData of rowData) {
      rowBasedData[rowClass.name].push(await page.evaluate(el => el.textContent, cellData))
    } 
  }

  const periodData = [];
  const length = rowBasedData['period'].length;
  for(let index = 0; index < length; index = index + 1){
    const singlePeriodData = {
      symbol,
      name,
      type: 'AnnualBalanceSheet'
    };
    for(const rowClass of rowClasses) {
      singlePeriodData[rowClass.name] = rowBasedData[rowClass.name][index];
    }
    periodData.push(singlePeriodData);
  }

  await browser.close();

  return periodData;
};

(async () => {

  const publisher = await redis.createClient({ socket: { host: "redis" } });;
  await publisher.connect();
  const subscriber = await redis.createClient({ socket: { host: "redis" } });;
  await subscriber.connect();

  const ANNUAL_BALANCE_SHEET = {
    INSTRUCTION_CHANNEL: 'instruction_annual_balance_sheet',
    DATA_CHANNEL: 'data_annual_balance_sheet',
    HEARTBEAT_CHANNEL: 'heatbeat_annual_balance_sheet'
  }

  await subscriber.subscribe(ANNUAL_BALANCE_SHEET.INSTRUCTION_CHANNEL, async (message) => {
    const data = JSON.parse(message);
    const responseData = await fetchData(data.tag, data.symbol, data.name);
    responseData.forEach(res => {
      publisher.publish(ANNUAL_BALANCE_SHEET.DATA_CHANNEL, JSON.stringify(res));
    });
  });

  setInterval(() => {
    publisher.publish(ANNUAL_BALANCE_SHEET.HEARTBEAT_CHANNEL, (new Date()).toISOString());
  }, 10000);
})();
