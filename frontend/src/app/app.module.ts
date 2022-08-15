import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoggingModule } from './logging/logging.module';
import { CompanyModule } from './company/company.module';
import { MacroeconomicModule } from './macroeconomic/macroeconomic.module';
import { FundamentalModule } from './fundamental/fundamental.module';
import { TechnicalModule } from './technical/technical.module';
import { ProcessModule } from './process/process.module';
import { MlModelModule } from './ml-model/ml-model.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    CompanyModule,
    MacroeconomicModule,
    FundamentalModule,
    TechnicalModule,
    ProcessModule,
    MlModelModule,
    LoggingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
