import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CreatedFundamentalResponse,
  Fundamental,
  LastFundamentalDateResponse,
  ListFundamentalResponse,
} from 'src/types/Fundamental';
import { FundamentalService } from './fundamental.service';

@Controller('fundamental')
export class FundamentalController {
  constructor(private readonly fundamentalService: FundamentalService) {}

  // Get for a symbol
  @Get('/all/:symbol')
  async getFundamentalsForCompany(
    @Param('symbol') symbol: string,
  ): Promise<ListFundamentalResponse> {
    const data = await this.fundamentalService.getFundamentalsForCompany(
      symbol,
    );
    return {
      data,
    };
  }

  // Get last for a symbol
  @Get('/last/:symbol')
  async getLastYearFundamentalsForCompany(
    @Param('symbol') symbol: string,
  ): Promise<LastFundamentalDateResponse> {
    const lastYear =
      this.fundamentalService.getLastYearFundamentalsForCompany(symbol)[0];
    return {
      data: {
        last: lastYear,
      },
    };
  }

  // Set for a symbol
  @Post('')
  async setFundamentalsForCompany(
    @Body() fundamentals: Fundamental[],
  ): Promise<CreatedFundamentalResponse> {
    const data = await this.fundamentalService.setFundamentalsForCompany(
      fundamentals,
    );
    return {
      data: {
        created: true,
        count: data.length,
      },
    };
  }
}
