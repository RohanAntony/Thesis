import { Component, OnInit } from '@angular/core';
import { Company } from 'src/app/shared/types/Company';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.component.html',
  styleUrls: ['./list-company.component.scss']
})
export class ListCompanyComponent implements OnInit {

  public companiesList: Company[] = [];
  public fetchedCompanies: boolean = false;
  public columnsToDisplay = ['symbol', 'name', 'ticker_tag', 'investing_tag', 'actions'];

  constructor(private companyService: CompanyService) { }

  ngOnInit(): void {
    this.companyService.getCompanies().subscribe((data: any) => {
      this.companiesList = data.data;
      this.fetchedCompanies = true;
    });
  }

  public executeProcess(elem: any) {
    console.log(elem);
  }

  public deleteData(elem: any) {
    console.log(elem);
  }

  public buildModel(elem: any) {
    console.log(elem);
  }

}
