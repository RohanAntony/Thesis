import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroeconomicComponent } from './macroeconomic.component';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [
    MacroeconomicComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports : [
    MacroeconomicComponent
  ]
})
export class MacroeconomicModule { }
