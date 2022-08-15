import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalComponent } from './technical.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    TechnicalComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    TechnicalComponent
  ]
})
export class TechnicalModule { }
