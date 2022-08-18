import { NgModule } from '@angular/core';
import { MacroeconomicComponent } from './macroeconomic.component';
import { NgChartsModule } from 'ng2-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { EditMacroeconomicComponent } from './edit-macroeconomic/edit-macroeconomic.component';
import { ViewMacroeconomicComponent } from './view-macroeconomic/view-macroeconomic.component';



@NgModule({
  declarations: [
    MacroeconomicComponent,
    EditMacroeconomicComponent,
    ViewMacroeconomicComponent
  ],
  imports: [
    SharedModule,
    NgChartsModule
  ],
  exports : [
    MacroeconomicComponent
  ]
})
export class MacroeconomicModule { }
