const puppeteer = require('puppeteer');

const fetchData = async (tickertag, symbol, name) => {
  const browser = await puppeteer.launch({
    defaultViewport: {
      width: 1920,
      height: 1080,
    }
  });
  const page = await browser.newPage();
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=annual&statement=income&view=normal`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  // const buttons = await page.$x("//*[contains(text(),'See Costs')]");
  // await buttons[0].click();

  const rowClasses = [
    { class: ".header-cell span", name: 'period'},
    { class: "div[data-row='incTrev'] .value-cell-content", name: 'totalRevenue'},
    { class: "div[data-row='incRaw'] .value-cell-content", name: 'rawMaterials'},
    { class: "div[data-row='incPfc'] .value-cell-content", name: 'powerAndFuelCost'},
    { class: "div[data-row='incEpc'] .value-cell-content", name: 'employeeCost'},
    { class: "div[data-row='incSga'] .value-cell-content", name: 'salesAndAdminExpenses'},
    { class: "div[data-row='incOpe'] .value-cell-content", name: 'operationsAndOtherExpenses'},
    { class: "div[data-row='incEbi'] .value-cell-content", name: 'ebitda'},
    { class: "div[data-row='incDep'] .value-cell-content", name: 'depreciationAndAmortization'},
    { class: "div[data-row='incPbi'] .value-cell-content", name: 'pbit'},
    { class: "div[data-row='incIoi'] .value-cell-content", name: 'interestAndOtherItems'},
    { class: "div[data-row='incPbt'] .value-cell-content", name: 'pbt'},
    { class: "div[data-row='incToi'] .value-cell-content", name: 'taxesAndOtherItems'},
    { class: "div[data-row='incNinc'] .value-cell-content", name: 'netIncome'},
    { class: "div[data-row='incEps'] .value-cell-content", name: 'eps'},
    { class: "div[data-row='incDps'] .value-cell-content", name: 'dps'},
    { class: "div[data-row='incPyr'] .value-cell-content", name: 'payoutRatio'},
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
      type: 'AnnualIncome'
    };
    for(const rowClass of rowClasses) {
      singlePeriodData[rowClass.name] = rowBasedData[rowClass.name][index];
    }
    periodData.push(singlePeriodData);
  }

  console.log(periodData);

  const screenshotPath = `./images/annualIncome/${symbol}.png`
  await page.screenshot({ path: screenshotPath, fullPage: true });

  await browser.close();
};

(async () => {
  const companiesList = require('./companies.json');
  for(const company of companiesList.all) {
    await fetchData(company.tickertag, company.symbol, company.name);
  }
})();