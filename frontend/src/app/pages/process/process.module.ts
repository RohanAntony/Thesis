import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessComponent } from './process.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ProcessComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    ProcessComponent
  ]
})
export class ProcessModule { }
