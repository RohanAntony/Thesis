import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { FormControl } from '@angular/forms';
import { FundamentalService } from '../fundamental.service';

@Component({
  selector: 'app-view-fundamentals',
  templateUrl: './view-fundamentals.component.html',
  styleUrls: ['./view-fundamentals.component.scss']
})
export class ViewFundamentalsComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public datasets: { data: number[], label: string }[] = [
    { data: [ 28, 48, 40, 65, 59, 80, 81 ], label: '2021' },
    { data: [ 23, 65, 59, 80, 40, 19, 86 ], label: '2022' }
  ];

  public years = [2022, 2021, 2020, 2019, 2018, 2017, 2016];
  public yearsSelected = new FormControl();

  // "symbol": "RELI",
  // "year": 2022,
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


  public allComponents = [{
    name: "Current Assets", value: 'currentAssets'
  },{
    name: "Non Current Assets", value: 'nonCurrentAssets'
  },{
    name: "Total Assets", value: 'totalAssets'
  },{
    name: "currentLiabilities", value: 'currentLiabilities'
  },{
    name: "nonCurrentLiabilities", value: 'nonCurrentLiabilities'
  },{
    name: "totalLiabilities", value: 'totalLiabilities'
  },{
    name: "totalEquity", value: 'totalEquity'
  },{
    name: "revenue", value: 'revenue'
  },{
    name: "netIncome", value: 'netIncome'
  },{
    name: "eps", value: 'eps'
  },{
    name: "netChangeInCash", value: 'netChangeInCash'
  },{
    name: "capex", value: 'capex'
  },{
    name: "freeCashFlow", value: 'freeCashFlow'
  },]
  public componentsSelected = new FormControl();

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        display: false,
        grid: {
          display: false,
        }
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];
  public barChartData: ChartData<'bar'> = {
    labels: [ 'Current Assets', 'Non Current Assets', 'Total Assets', 'Current Liabilities', 'Non Current Liabilities', 'Total Liabilities', 'Net Income' ],
    datasets: this.datasets
  };

  constructor(private fundamentalService: FundamentalService) { }

  ngOnInit(): void {
    this.fundamentalService.fetchFundamentalsForSymbol('RELI').subscribe((data) => console.log(data));
  }

  public fetchData() {

  }

}
