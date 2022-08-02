import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoggingComponent } from './logging/logging.component';
import { MaterialModule } from './material/material.module';
import { SettingsComponent } from './settings/settings.component';
import { NavType } from './types/Navigation';

const routes: Routes = [{
  path: NavType.DASHBOARD,
  component: DashboardComponent,
}, {
  path: NavType.SETTINGS,
  component: SettingsComponent,
}, {
  path: NavType.LOGS,
  component: LoggingComponent
}, {
  path: '*',
  redirectTo: NavType.DASHBOARD,
}];

@NgModule({
  imports: [
    MaterialModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
