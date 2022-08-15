import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fundamental } from 'src/types/Fundamental';

@Injectable()
export class FundamentalService {
  constructor(
    @InjectModel('Fundamental')
    private readonly fundamentalModel: Model<Fundamental>,
  ) {}

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
}
