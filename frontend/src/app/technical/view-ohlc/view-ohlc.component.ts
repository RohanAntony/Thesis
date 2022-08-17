import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { de, enUS } from 'date-fns/locale';
import { BaseChartDirective } from 'ng2-charts';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement, } from 'chartjs-chart-financial';
import parseISO from 'date-fns/parseISO';
import add from 'date-fns/add';
import { TechnicalService } from '../technical.service';
import { OHLC } from 'src/app/shared/types/OHLC';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-ohlc',
  templateUrl: './view-ohlc.component.html',
  styleUrls: ['./view-ohlc.component.scss']
})
export class ViewOhlcComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  public companies = [{
    name: "Reliance Industries Ltd",
    symbol: "RELI"
  },{
    name: "Bajaj Finance Ltd",
    symbol: "BJFN",
  }];

  public selectedCompany: string = '';

  private data: any[] = [];

  // public startDate: any;
  // public endDate: any;

  public financialChartData: ChartConfiguration['data'] = {
    datasets: [ {
      data: []
    }]
  };
  public financialChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
        time: {
          unit: 'day'
        },
        adapters: {
          date: {
            locale: enUS
          }
        },
        ticks: {
          source: 'auto'
        }
      },
      y: {
        grid: {
          display: false,
        },
      }
    },
    borderColor: 'black',
    backgroundColor: 'rgba(255,0,0,0,0.3)',
    plugins: {
      legend: {
        display: false
      }
    }
  };
  public financialChartType: ChartType = 'candlestick';

  constructor(private technicalService: TechnicalService) {
    Chart.register(CandlestickController, OhlcController, CandlestickElement, OhlcElement);
  }

  ngOnInit(): void {
  }

  private convertDataToAppropriateFormat(input: OHLC): { c: number; x: number; h: number; l: number; o: number }{
    return {
      x: +parseISO(input.date),
      o: input.open,
      h: input.high,
      l: input.low,
      c: input.close
    };
  }

  public fetchData() {
    if(!this.selectedCompany) {
      this.selectedCompany = this.companies[0].symbol;
    }
    if(!this.range.value.start) {
      this.range.value.start = new Date('Aug 01, 2022');
    }
    if(!this.range.value.end) {
      this.range.value.end = new Date();
    }
    console.log(this.selectedCompany);
    console.log(this.range.value);
    const symbol = this.selectedCompany;
    const startDate = this.range.value.start;
    const endDate = this.range.value.end;
    this.technicalService.getOHLCForCompanyBetweenTimePeriod(symbol, startDate, endDate).subscribe((data) => {
      this.data = data.data.map((datum) => this.convertDataToAppropriateFormat(datum));
      this.financialChartData.datasets[0].data = this.data;
      this.chart?.update();
    });
  }

  update(): void {
    // candlestick vs ohlc
    this.financialChartType = this.financialChartType === 'candlestick' ? 'ohlc' : 'candlestick';
  }

}


