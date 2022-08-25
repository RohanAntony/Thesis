import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { FundamentalSchemaName } from 'src/schemas/fundamental.schema';
import { Fundamental } from 'src/types/Fundamental';

@Injectable()
export class FundamentalService {
  private redisClient: Redis;

  constructor(
    @InjectModel(FundamentalSchemaName)
    private readonly fundamentalModel: Model<Fundamental>,
  ) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: 'redis',
      port: 6379,
    });
    this.redisClient.subscribe('fundamental');
    this.redisClient.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  async getFundamentalsForCompany(symbol: string) {
    return await this.fundamentalModel.find(
      {
        symbol,
      },
      {
        _id: 0,
        __v: 0,
      },
    );
  }

  async setFundamentalsForCompany(fundamentals: Fundamental[]) {
    const updated = fundamentals.map((fundamental) => {
      const _id = `${fundamental.year}${fundamental.symbol}`;
      const updated = {
        ...fundamental,
        _id,
      };
      return updated;
    });
    return await this.fundamentalModel.create(updated);
  }

  async getLastYearFundamentalsForCompany(symbol: string) {
    return await this.fundamentalModel
      .find(
        {
          symbol,
        },
        {
          _id: 0,
          __v: 0,
        },
      )
      .sort({
        year: -1,
      })
      .limit(1);
  }

  handleMessage(channel, message) {
    console.log(`${channel}: ${message}`);
  }
}
