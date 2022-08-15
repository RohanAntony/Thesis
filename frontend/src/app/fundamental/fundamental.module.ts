import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundamentalComponent } from './fundamental.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    FundamentalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    FundamentalComponent
  ]
})
export class FundamentalModule { }
