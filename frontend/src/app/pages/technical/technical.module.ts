import { NgModule } from '@angular/core';
import { TechnicalComponent } from './technical.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ComparePricesComponent } from './compare-prices/compare-prices.component';
import { ViewOhlcComponent } from './view-ohlc/view-ohlc.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    TechnicalComponent,
    ViewOhlcComponent,
    ComparePricesComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    TechnicalComponent
  ]
})
export class TechnicalModule { }
