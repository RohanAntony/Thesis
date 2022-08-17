import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { OhlcService } from './ohlc.service';
import {
  CreatedOHLCResponse,
  DeletedOHLCResponse,
  LastOHLCDateResponse,
  ListOHLCResponse,
  OHLC,
} from '../../types/OHLC';

@Controller('ohlc')
export class OhlcController {
  constructor(private readonly ohlcService: OhlcService) {}

  @Get('/all/:symbol')
  async getSecurityOHLC(
    @Param('symbol') symbol: string,
  ): Promise<ListOHLCResponse> {
    return {
      data: await this.ohlcService.getSecurityOHLC(symbol),
    };
  }

  @Get('/range')
  async getSecurityOHLCForRange(
    @Query() query: { symbol: string; start: string; end: string },
  ): Promise<ListOHLCResponse> {
    return {
      data: await this.ohlcService.getSecurityOHLCForRange(
        query.symbol,
        query.start,
        query.end,
      ),
    };
  }

  @Get('/last/:symbol')
  async getLastSecurityOHLC(
    @Param('symbol') symbol: string,
  ): Promise<LastOHLCDateResponse> {
    const lastDate = await this.ohlcService.getLastDateSecurityOHLC(symbol)[0];
    return {
      data: {
        last: lastDate,
      },
    };
  }

  @Post()
  async saveSecurityOHLC(@Body() ohlcs: OHLC[]): Promise<CreatedOHLCResponse> {
    const data = await this.ohlcService.saveSecurityOHLC(ohlcs);
    return {
      data: {
        created: true,
        count: data.length,
      },
    };
  }

  @Delete(':symbol')
  async deleteSecurityOHLC(
    @Param('symbol') symbol: string,
  ): Promise<DeletedOHLCResponse> {
    const data = await this.ohlcService.deleteSecurityOHLC(symbol);
    return {
      data: {
        deleted: data.acknowledged,
        count: data.deletedCount,
      },
    };
  }
}
