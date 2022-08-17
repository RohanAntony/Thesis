import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundamentalComponent } from './fundamental.component';
import { MaterialModule } from '../material/material.module';
import { ViewFundamentalsComponent } from './view-fundamentals/view-fundamentals.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [
    FundamentalComponent,
    ViewFundamentalsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
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
