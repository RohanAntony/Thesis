import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URLs } from '../shared/enums/URL';
import { Company } from '../shared/types/Company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) { }

  addCompany(company: Company) {
    return this.http.post(URLs.COMPANY, company);
  }

  getCompanies() {
    return this.http.get<Company[]>(URLs.COMPANY);
  }
}
