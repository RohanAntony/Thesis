import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  Company,
  CreatedCompanyResponse,
  ListCompaniesResponse,
} from '../../types/Company';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  async getCompanies(): Promise<ListCompaniesResponse> {
    console.log('Testing');
    const data = await this.companyService.getCompanies();
    return {
      data,
    };
  }

  @Post()
  async addCompany(@Body() company: Company): Promise<CreatedCompanyResponse> {
    await this.companyService.addCompany(company as Company);
    return {
      data: {
        created: true,
        count: 1,
      },
    };
  }
}
