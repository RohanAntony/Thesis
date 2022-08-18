import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggingModule } from './pages/logging/logging.module';
import { ProcessModule } from './pages/process/process.module';
import { MlModelModule } from './pages/ml-model/ml-model.module';
import { NgChartsModule } from 'ng2-charts';
import { CompanyModule } from './pages/company/company.module';
import { FundamentalModule } from './pages/fundamental/fundamental.module';
import { MacroeconomicModule } from './pages/macroeconomic/macroeconomic.module';
import { TechnicalModule } from './pages/technical/technical.module';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CompanyModule,
    MacroeconomicModule,
    FundamentalModule,
    TechnicalModule,
    ProcessModule,
    MlModelModule,
    LoggingModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
