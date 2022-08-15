import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ListMacroeconomicResponse,
  MacroeconomicType,
  ModifiedMacroeconomicResponse,
} from 'src/types/Macroeconomic';
import { MacroeconomicService } from './macroeconomic.service';

@Controller('macroeconomic')
export class MacroeconomicController {
  constructor(private macroeconomicService: MacroeconomicService) {}

  @Get(':type')
  async getValuesForType(
    @Param('type') type: MacroeconomicType,
  ): Promise<ListMacroeconomicResponse> {
    return {
      data: await this.macroeconomicService.getValuesForType(type),
    };
  }

  @Post('')
  async setValueForType(
    @Body('type') type: MacroeconomicType,
    @Body('year') year: number,
    @Body('value') value: number,
  ): Promise<ModifiedMacroeconomicResponse> {
    await this.macroeconomicService.setValueForType(type, year, value);
    return {
      data: {
        modified: true,
        count: 1,
      },
    };
  }
}
