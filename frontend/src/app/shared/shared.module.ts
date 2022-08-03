import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';



@NgModule({
  declarations: [
    BarChartComponent,
    LineChartComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BarChartComponent,
    LineChartComponent
  ]
})
export class SharedModule { }
