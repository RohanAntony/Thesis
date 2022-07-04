const puppeteer = require('puppeteer');

const fetchData = async (tickertag, symbol, name) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    }
  });
  const page = await browser.newPage();
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=cashflow`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  // const buttons = await page.$x("//*[contains(text(),'See Costs')]");
  // await buttons[0].click();

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

  console.log(periodData);

  const screenshotPath = `./images/annualCashFlow/${symbol}.png`
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
};

(async () => {
  const companiesList = require('../companies.json');
  for(const company of companiesList.all) {
    await fetchData(company.tickertag, company.symbol, company.name);
  }
})();