import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggingComponent } from '../logging/logging.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    LoggingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    LoggingComponent
  ]
})
export class LoggingModule { }
