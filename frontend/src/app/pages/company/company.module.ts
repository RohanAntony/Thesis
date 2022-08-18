import { NgModule } from '@angular/core';
import { CompanyComponent } from './company.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AddCompanyComponent } from './add-company/add-company.component';
import { ListCompanyComponent } from './list-company/list-company.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    CompanyComponent,
    AddCompanyComponent,
    ListCompanyComponent
  ],
  imports: [
    SharedModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    CompanyComponent
  ]
})
export class CompanyModule { }
