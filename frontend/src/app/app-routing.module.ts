import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggingComponent } from './pages/logging/logging.component';
import { MlModelComponent } from './pages/ml-model/ml-model.component';
import { ProcessComponent } from './pages/process/process.component';
import { NavType } from './shared/enums/Navigation';
import { CompanyComponent } from './pages/company/company.component';
import { FundamentalComponent } from './pages/fundamental/fundamental.component';
import { MacroeconomicComponent } from './pages/macroeconomic/macroeconomic.component';
import { TechnicalComponent } from './pages/technical/technical.component';
import { SharedModule } from './shared/shared.module';

const routes: Routes = [{
  path: NavType.COMPANY,
  component: CompanyComponent,
}, {
  path: NavType.PROCESSES,
  component: ProcessComponent
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
  path: NavType.LOGS,
  component: LoggingComponent
}, {
  path: '*',
  redirectTo: NavType.COMPANY,
}];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
