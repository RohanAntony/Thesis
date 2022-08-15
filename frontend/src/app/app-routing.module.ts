import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyComponent } from './company/company.component';
import { FundamentalComponent } from './fundamental/fundamental.component';
import { LoggingComponent } from './logging/logging.component';
import { MacroeconomicComponent } from './macroeconomic/macroeconomic.component';
import { MaterialModule } from './material/material.module';
import { MlModelComponent } from './ml-model/ml-model.component';
import { ProcessComponent } from './process/process.component';
import { NavType } from './shared/enums/Navigation';
import { TechnicalComponent } from './technical/technical.component';

const routes: Routes = [{
  path: NavType.COMPANY,
  component: CompanyComponent,
}, {
  path: NavType.MACROECONOMIC,
  component: MacroeconomicComponent,
}, {
  path: NavType.FUNDAMENTALS,
  component: FundamentalComponent
}, {
  path: NavType.TECHNICAL,
  component: TechnicalComponent
}, {
  path: NavType.MODEL,
  component: MlModelComponent
}, {
  path: NavType.PROCESSES,
  component: ProcessComponent
}, {
  path: NavType.LOGS,
  component: LoggingComponent
}, {
  path: '*',
  redirectTo: NavType.COMPANY,
}];

@NgModule({
  imports: [
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
