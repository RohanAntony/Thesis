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
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=cashflow`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  const rowClasses = [
    { class: ".period-text span", name: 'period'},
    { class: "td[data-row='cafCfoa'] .value-cell-content", name: 'cashFromOperatingActivities'},
    { class: "td[data-row='cafCfia'] .value-cell-content", name: 'cashFromInvestingActivities'},
    { class: "td[data-row='cafCffa'] .value-cell-content", name: 'cashFromFinancingActivities'},
    { class: "td[data-row='cafNcic'] .value-cell-content", name: 'netChangeInCash'},
    { class: "td[data-row='cafCiwc'] .value-cell-content", name: 'changesInWorkingCapital'},
    { class: "td[data-row='cafCexp'] .value-cell-content", name: 'capitalExpenditures'},
    { class: "td[data-row='cafFcf'] .value-cell-content", name: 'freeCashFlow'},
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
      type: 'AnnualCashFlow'
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

  const ANNUAL_CASH_FLOW = {
    INSTRUCTION_CHANNEL: 'instruction_annual_cash_flow',
    DATA_CHANNEL: 'data_annual_cash_flow',
    HEARTBEAT_CHANNEL: 'heartbeat_annual_cash_flow',
  }

  await subscriber.subscribe(ANNUAL_CASH_FLOW.INSTRUCTION_CHANNEL, async (message) => {
    const data = JSON.parse(message);
    const responseData = await fetchData(data.tag, data.symbol, data.name);
    responseData.forEach(res => {
      publisher.publish(ANNUAL_CASH_FLOW.DATA_CHANNEL, JSON.stringify(res));
    });
  });

  setInterval(() => {
    publisher.publish(ANNUAL_CASH_FLOW.HEARTBEAT_CHANNEL, (new Date()).toISOString());
  }, 10000);
})();
