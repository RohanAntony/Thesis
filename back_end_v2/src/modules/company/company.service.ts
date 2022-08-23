import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../types/Company';

import * as config from '../../../config.json';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel('Company') private readonly companyModel: Model<Company>,
    @Inject(config.REDIS.HOSTNAME) private redisService: ClientProxy,
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
    console.log(`Publishing to channel ${config.REDIS.LOG_CHANNEL}: Test`);
    this.redisService.emit(config.REDIS.LOG_CHANNEL, 'Test');
    return await this.companyModel.find(
      {},
      {
        _id: 0,
        __v: 0,
      },
    );
  }
}
