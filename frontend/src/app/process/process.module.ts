import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    ProcessComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    ProcessComponent
  ]
})
export class ProcessModule { }
