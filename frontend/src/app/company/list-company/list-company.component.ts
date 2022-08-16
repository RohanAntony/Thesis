import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/types/Company';
import { CompanyService } from '../company.service';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent implements OnInit {

  public companiesList: Company[] = [];
  public fetchedCompanies: boolean = false;
  public columnsToDisplay = ['symbol', 'name', 'ticker_tag', 'investing_tag'];

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe((data: any) => {
      this.companiesList = data.data;
      this.fetchedCompanies = true;
    });
  }

}
