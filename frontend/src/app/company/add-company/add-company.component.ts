import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/types/Company';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  public data: Company = {
    name: '',
    symbol: '',
    ticker_tag: '',
    investing_tag: ''
  };

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
  }

  public addNewCompany() {
    this.companyService.addCompany(this.data).subscribe((data: any) => console.log(data));
  }

}
