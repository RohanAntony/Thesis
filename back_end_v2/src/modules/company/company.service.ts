import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company } from '../../types/Company';

import * as config from '../../../config.json';
import Redis from 'ioredis';
import { CompanySchemaName } from 'src/schemas/company.schema';

@Injectable()
export class CompanyService {
  private redisClient: Redis;

  constructor(
    @InjectModel(CompanySchemaName)
    private readonly companyModel: Model<Company>,
  ) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: 'redis',
      port: 6379,
    });
    this.redisClient.subscribe('company');
    this.redisClient.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  async addCompany(company: Company): Promise<Company> {
    // ToDo: Schedule extraction and ML model operation
    const newCompany = new this.companyModel({
      ...company,
      _id: company.symbol,
    });
    return await newCompany.save();
  }

  async getCompanies(): Promise<Company[]> {
    console.log(`Publishing to channel logging: Test`);
    return await this.companyModel.find(
      {},
      {
        _id: 0,
        __v: 0,
      },
    );
  }

  handleMessage(channel, message) {
    console.log(`${channel}: ${message}`);
  }
}
