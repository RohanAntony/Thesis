import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacroeconomicComponent } from './macroeconomic.component';
import { MaterialModule } from '../material/material.module';
import { EditMacroeconomicComponent } from './edit-macroeconomic/edit-macroeconomic.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ViewMacroeconomicComponent } from './view-macroeconomic/view-macroeconomic.component';
import { SharedModule } from '../shared/shared.module';
import { NgChartsModule } from 'ng2-charts';



@NgModule({
  declarations: [
    MacroeconomicComponent,
    EditMacroeconomicComponent,
    ViewMacroeconomicComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    NgChartsModule
  ],
  exports : [
    MacroeconomicComponent
  ]
})
export class MacroeconomicModule { }
