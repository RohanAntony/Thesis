import { Component, OnInit, ViewChild } from '@angular/core';
import { Macroeconomic, MacroeconomicType } from 'src/app/shared/types/Macroeconomic';
import { MacroeconomicService } from '../macroeconomic.service';
import { forkJoin } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartDataset } from 'chart.js';

import {default as Annotation} from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-view-macroeconomic',
  templateUrl: './view-macroeconomic.component.html',
  styleUrls: ['./view-macroeconomic.component.scss']
})
export class ViewMacroeconomicComponent implements OnInit {

  private joinThreeArraysIntoSingle(inflation: Macroeconomic[], gdp: Macroeconomic[], unemployment: Macroeconomic[]) {
    const all: any = {};
    for(let arr of [inflation, gdp, unemployment]) {
      for(let elem of arr) {
        if (!all[elem.year]) {
          all[elem.year] = {
            year: elem.year,
          };
        }
        all[elem.year][elem.type] = elem.value;
      }
    }
    // duplicate labels;
    let data = Object.keys(all).map((elem) => all[elem]);
    return data;
  }

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  public data: any[] = [];
  public labels: number[] = [];
  public datasets = [{
    data: this.data,
    label: MacroeconomicType.INFLATION,
    borderColor: 'red',
    pointBorderColor: 'red',
    pointBackgroundColor: 'pink',
    backgroundColor: 'white',
  }, {
    data: this.data,
    label: MacroeconomicType.GDP,
    borderColor: 'green',
    pointBorderColor: 'green',
    pointBackgroundColor: 'lightgreen',
    backgroundColor: 'white',
  },{
    data: this.data,
    label: MacroeconomicType.UNEMPLOYMENT,
    borderColor: 'blue',
    pointBorderColor: 'blue',
    pointBackgroundColor: 'lightblue',
    backgroundColor: 'white',
  }];
  public lineChartData: ChartConfiguration['data'] = {
    datasets: this.datasets,
    labels: this.labels,
  };
  public lineChartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        position: 'left',
        grid: {
          display: false
        }
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      annotation: {
        annotations: [
          {
            type: 'line',
            scaleID: 'y',
            value: 0,
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      }
    }
  };

  constructor(private macroeconomicService: MacroeconomicService) {
    Chart.register(Annotation)
  }

  ngOnInit(): void {
    forkJoin({
      inflation: this.macroeconomicService.getValuesForType(MacroeconomicType.INFLATION),
      gdp: this.macroeconomicService.getValuesForType(MacroeconomicType.GDP),
      unemployment: this.macroeconomicService.getValuesForType(MacroeconomicType.UNEMPLOYMENT),
    }).subscribe(({
      inflation, gdp, unemployment
    }) => {
      // hack to rename object keys
      const data = this.joinThreeArraysIntoSingle(inflation.data, gdp.data, unemployment.data);
      this.datasets[0].data = data.map((elem) => elem[MacroeconomicType.INFLATION]);
      this.datasets[1].data = data.map((elem) => elem[MacroeconomicType.GDP]);
      this.datasets[2].data = data.map((elem) => elem[MacroeconomicType.UNEMPLOYMENT]);
      this.labels = data.map((elem) => elem['year']);
      this.lineChartData.datasets = this.datasets;
      this.lineChartData.labels = this.labels;
      this.chart?.update();
    })
  }
}
