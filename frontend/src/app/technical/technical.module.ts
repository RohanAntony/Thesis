import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalComponent } from './technical.component';
import { MaterialModule } from '../material/material.module';
import { ViewOhlcComponent } from './view-ohlc/view-ohlc.component';
import { ComparePricesComponent } from './compare-prices/compare-prices.component';
import { NgChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TechnicalComponent,
    ViewOhlcComponent,
    ComparePricesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  exports: [
    TechnicalComponent
  ]
})
export class TechnicalModule { }
