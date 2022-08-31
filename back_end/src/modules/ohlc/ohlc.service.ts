import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { OHLCSchemaName } from 'src/schemas/ohlc.schema';
import { OHLC } from 'src/types/OHLC';

@Injectable()
export class OhlcService {
  private redisClient: Redis;

  constructor(
    @InjectModel(OHLCSchemaName) private readonly ohlcModel: Model<OHLC>,
  ) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: 'redis',
      port: 6379,
    });
    this.redisClient.subscribe('ohlc');
    this.redisClient.on('message', (channel, message) => {
      this.handleMessage(channel, message);
    });
  }

  async getSecurityOHLC(symbol: string) {
    return await this.ohlcModel.find(
      {
        symbol,
      },
      {
        _id: 0,
        __v: 0,
      },
    );
  }

  async getSecurityOHLCForRange(symbol: string, start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return await this.ohlcModel.find(
      {
        symbol,
        date: {
          $lte: endDate,
          $gte: startDate,
        },
      },
      {
        _id: 0,
        __v: 0,
      },
    );
  }

  async saveSecurityOHLC(ohlcs: OHLC[]) {
    await this.ohlcModel.deleteMany({
      symbol: ohlcs[0].symbol,
    })
    const updated = ohlcs.map((ohlc) => {
      const _id = `${new Date(ohlc.date).getTime()}${ohlc.symbol}`;
      const updated = {
        ...ohlc,
        date: new Date(ohlc.date),
        _id,
      };
      return updated;
    });
    console.log(await this.ohlcModel.create(updated));
  }

  async deleteSecurityOHLC(symbol: string) {
    return await this.ohlcModel.deleteMany({
      symbol,
    });
  }

  async getLastDateSecurityOHLC(symbol: string) {
    return await this.ohlcModel
      .find(
        {
          symbol,
        },
        {
          date: 1,
        },
      )
      .sort({
        date: -1,
      })
      .limit(1);
  }

  handleMessage(channel: string, message: string) {
    const ohlcs = JSON.parse(message);
    // console.log(channel, message, ohlcs);
    console.log(channel, typeof message);
    this.saveSecurityOHLC(ohlcs);
  }
}
