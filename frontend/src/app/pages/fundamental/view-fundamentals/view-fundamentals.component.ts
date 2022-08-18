import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { FormControl } from '@angular/forms';
import { FundamentalService } from '../../../services/fundamental.service';
import { Fundamental, FundamentalKeys, FUNDAMENTAL_KEY_OPTIONS } from 'src/app/shared/types/Fundamental';
import { CompanyService } from 'src/app/services/company.service';
import { Company } from 'src/app/shared/types/Company';

@Component({
  selector: 'app-view-fundamentals',
  templateUrl: './view-fundamentals.component.html',
  styleUrls: ['./view-fundamentals.component.scss']
})
export class ViewFundamentalsComponent implements OnInit {

  private generateLabels(selectedComponents: { name: string, value: string}[] | null) {
    return selectedComponents ?
      selectedComponents.map((elem: {name: string, value: string}) => elem.name) :
      ['']
  }

  private generateDatasets(data: Fundamental[],
    selectedComponents: { name: string, value: FundamentalKeys }[] | null,
    yearsSelected: number[] | null) {
    let datasets: { data: number[], label: string }[] = [];
    for(let datum of data) {
      if(yearsSelected && yearsSelected.includes(datum.year)) {
        const dataset: { label: string, data: any[], yAxisID?: string} = { label: `${datum.year}`, data : [] };
        if(selectedComponents) {
          for(let component of selectedComponents) {
            dataset.data.push(datum[component.value]);
          }
          datasets.push(dataset);
        }
      }
    }
    return datasets;
  }

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  public displayChart: boolean = false;

  public companies: any[] = [];
  public selectedCompany: string = '';

  public years = [2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012];
  public yearsSelected = new FormControl([
    this.years[0],
    this.years[1],
    this.years[2],
  ]);

  public allComponents = FUNDAMENTAL_KEY_OPTIONS;
  public componentsSelected = new FormControl([
    this.allComponents[2],
    this.allComponents[5],
    this.allComponents[6],
    this.allComponents[7],
    this.allComponents[8]
  ]);

  public datasets: { data: number[], label: string, yAxisID?: string }[] = [];

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
      y2: {
        display: false,
        grid: {
          display: false,
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'center',
        align: 'center'
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];
  public barChartData: ChartData<'bar'> = {
    labels: this.generateLabels(this.componentsSelected.value),
    datasets: this.datasets,
  };

  constructor(
    private fundamentalService: FundamentalService,
    private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe((data: { data: Company[] }) => {
      this.companies = data.data;
    });
  }

  public fetchData() {
    this.selectedCompany = this.selectedCompany ? this.selectedCompany : 'RELI';
    this.fundamentalService.fetchFundamentalsForSymbol(this.selectedCompany).subscribe((data) => {
      this.displayChart = true;
      this.barChartData.labels = this.generateLabels(this.componentsSelected.value);
      this.barChartData.datasets = this.generateDatasets(data.data, this.componentsSelected.value, this.yearsSelected.value);
      if(this.chart)
        this.chart.update();
    });
  }

}
