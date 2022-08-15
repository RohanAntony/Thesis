import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MlModelComponent } from './ml-model.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    MlModelComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    MlModelComponent
  ]
})
export class MlModelModule { }
