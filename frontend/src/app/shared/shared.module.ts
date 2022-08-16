import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './chart/bar-chart/bar-chart.component';
import { LineChartComponent } from './chart/line-chart/line-chart.component';
import { NgChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    BarChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule
  ],
  exports: [
    BarChartComponent,
    LineChartComponent
  ]
})
export class SharedModule { }
