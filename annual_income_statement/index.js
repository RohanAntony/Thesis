const puppeteer = require('puppeteer');
const redis = require('redis');

const config = require('./config.json');

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
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=income&view=normal`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  const rowClasses = [
    { class: ".period-text span", name: 'period'},
    { class: "td[data-row='incTrev'] .value-cell-content", name: 'totalRevenue'},
    { class: "td[data-row='incRaw'] .value-cell-content", name: 'rawMaterials'},
    { class: "td[data-row='incPfc'] .value-cell-content", name: 'powerAndFuelCost'},
    { class: "td[data-row='incEpc'] .value-cell-content", name: 'employeeCost'},
    { class: "td[data-row='incSga'] .value-cell-content", name: 'salesAndAdminExpenses'},
    { class: "td[data-row='incOpe'] .value-cell-content", name: 'operationsAndOtherExpenses'},
    { class: "td[data-row='incEbi'] .value-cell-content", name: 'ebitda'},
    { class: "td[data-row='incDep'] .value-cell-content", name: 'depreciationAndAmortization'},
    { class: "td[data-row='incPbi'] .value-cell-content", name: 'pbit'},
    { class: "td[data-row='incIoi'] .value-cell-content", name: 'interestAndOtherItems'},
    { class: "td[data-row='incPbt'] .value-cell-content", name: 'pbt'},
    { class: "td[data-row='incToi'] .value-cell-content", name: 'taxesAndOtherItems'},
    { class: "td[data-row='incNinc'] .value-cell-content", name: 'netIncome'},
    { class: "td[data-row='incEps'] .value-cell-content", name: 'eps'},
    { class: "td[data-row='incDps'] .value-cell-content", name: 'dps'},
    { class: "td[data-row='incPyr'] .value-cell-content", name: 'payoutRatio'},
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
      type: config.DOCUMENT.AIS
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

  const publisher = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  await publisher.connect();
  const subscriber = await redis.createClient({ socket: { host: config.REDIS.HOSTNAME } });;
  await subscriber.connect();

  await subscriber.subscribe(config.REDIS.AIS_CHANNEL.INSTRUCTION, async (message) => {
    const data = JSON.parse(message);
    const responseData = await fetchData(data.tag, data.symbol, data.name);
    responseData.forEach(res => {
      publisher.publish(config.REDIS.AIS_CHANNEL.DATA, JSON.stringify(res));
    });
  });

  setInterval(() => {
    publisher.publish(config.REDIS.AIS_CHANNEL.HEARTBEAT, (new Date()).toISOString());
  }, 10000);
})();