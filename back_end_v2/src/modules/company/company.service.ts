import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../types/Company';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company') private readonly companyModel: Model<Company>,
  ) {}

  async addCompany(company: Company): Promise<Company> {
    // ToDo: Schedule extraction and ML model operation
    const newCompany = new this.companyModel({
      ...company,
      _id: company.symbol,
    });
    return await newCompany.save();
  }

  async getCompanies(): Promise<Company[]> {
    return await this.companyModel.find(
      {},
      {
        _id: 0,
        __v: 0,
      },
    );
  }
}
