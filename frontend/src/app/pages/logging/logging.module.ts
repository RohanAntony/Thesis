import { NgModule } from '@angular/core';
import { LoggingComponent } from './logging.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    LoggingComponent
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    LoggingComponent
  ]
})
export class LoggingModule { }
