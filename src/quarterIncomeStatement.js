const puppeteer = require('puppeteer');

const fetchData = async (tickertag, symbol, name) => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 1080,
    }
  });
  const page = await browser.newPage();
  const url = `https://www.tickertape.in/stocks/${tickertag}/financials?checklist=basic&period=quarter&statement=income&view=normal`
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.addStyleTag({
    content: '#__next > .ttactions-root { position: inherit }'
  })

  const buttons = await page.$x("/html/body/div/div[3]/div/div/div[2]/div[2]/div[2]/div[2]/div[1]/div/div/span");
  await buttons[0].click();

  const quarterlyButtons = await page.$x("/html/body/div/div[3]/div/div/div[2]/div[2]/div[2]/div[2]/div[1]/div/div/div/ul/div[1]/div[2]/div[1]/p");
  await quarterlyButtons[0].click();

  // const buttons = await page.$x("//*[contains(text(),'See Costs')]");
  // await buttons[0].click();

  const rowClasses = [
    { class: ".period-text span", name: 'period'},
    { class: "td[data-row='qIncTrev'] .value-cell-content", name: 'totalRevenue'},
    { class: "td[data-row='qIncOpe'] .value-cell-content", name: 'operationsAndOtherExpenses'},
    { class: "td[data-row='qIncEbi'] .value-cell-content", name: 'ebitda'},
    { class: "td[data-row='qIncDep'] .value-cell-content", name: 'depreciationAndAmortization'},
    { class: "td[data-row='qIncPbi'] .value-cell-content", name: 'pbit'},
    { class: "td[data-row='qIncIoi'] .value-cell-content", name: 'interestAndOtherItems'},
    { class: "td[data-row='qIncPbt'] .value-cell-content", name: 'pbt'},
    { class: "td[data-row='qIncToi'] .value-cell-content", name: 'taxesAndOtherItems'},
    { class: "td[data-row='qIncNinc'] .value-cell-content", name: 'netIncome'},
    { class: "td[data-row='qIncEps'] .value-cell-content", name: 'eps'},
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
      type: 'QuarterIncome'
    };
    for(const rowClass of rowClasses) {
      singlePeriodData[rowClass.name] = rowBasedData[rowClass.name][index];
    }
    periodData.push(singlePeriodData);
  }

  console.log(periodData);

  // const screenshotPath = `../images/quarterIncome/${symbol}.png`
  // await page.screenshot({ path: screenshotPath, fullPage: true });

  // await browser.close();
};

(async () => {
  const companiesList = require('../companies.json');
  for(const company of companiesList.all) {
    await fetchData(company.tickertag, company.symbol, company.name);
  }
})();