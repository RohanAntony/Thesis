import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroeconomicComponent } from './macroeconomic.component';
import { MaterialModule } from '../material/material.module';
import { EditMacroeconomicComponent } from './edit-macroeconomic/edit-macroeconomic.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    MacroeconomicComponent,
    EditMacroeconomicComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
  ],
  exports : [
    MacroeconomicComponent
  ]
})
export class MacroeconomicModule { }
