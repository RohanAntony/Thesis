const puppeteer = require('puppeteer');

const fetchData = async (tickertag, symbol, name) => {
  const browser = await puppeteer.launch({
    // headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    }
  });
  const page = await browser.newPage();
  const url = `https://www.tickertape.in/stocks/${tickertag}/events?checklist=basic&type=dividends`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  let buttons = await page.$x("//*[contains(text(),'Load more')]");
  while(buttons.length > 0) {
    await Promise.all([ 
      buttons[0].click(),
      page.waitForNetworkIdle()
    ]);
    buttons = await page.$x("//*[contains(text(),'Load more')]");
  }

  const rowClasses = [
    // { class: ".event-table-data-title", name: 'title'},
    // { class: ".table-col-title .desktop--only .desktop--only span span span", name: 'title'},
    { class: ".table-col-date .event-table-data span", name: 'exchangeDate'},
    { class: ".table-col-info .event-table-data > span", name: 'dividendPerShare'}
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
  const length = rowBasedData['exchangeDate'].length;
  for(let index = 0; index < length; index = index + 1){
    const singlePeriodData = {
      symbol,
      name,
      type: 'Dividend'
    };
    for(const rowClass of rowClasses) {
      singlePeriodData[rowClass.name] = rowBasedData[rowClass.name][index];
    }
    periodData.push(singlePeriodData);
  }

  console.log(periodData);

  const screenshotPath = `./images/dividends/${symbol}.png`
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
};

(async () => {
  const companiesList = require('../companies.json');
  for(const company of companiesList.all) {
    await fetchData(company.tickertag, company.symbol, company.name);
  }
})();