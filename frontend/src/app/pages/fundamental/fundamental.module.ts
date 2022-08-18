import { NgModule } from '@angular/core';
import { FundamentalComponent } from './fundamental.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ViewFundamentalsComponent } from './view-fundamentals/view-fundamentals.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    FundamentalComponent,
    ViewFundamentalsComponent
  ],
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgChartsModule
  ],
  exports: [
    FundamentalComponent
  ]
})
export class FundamentalModule { }
