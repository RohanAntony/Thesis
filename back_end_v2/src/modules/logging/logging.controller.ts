import { Controller, Get } from '@nestjs/common';
import { ListLogsResponse } from 'src/types/Log';
import { LoggingService } from './logging.service';

@Controller('logging')
export class LoggingController {
  constructor(private readonly loggingService: LoggingService) {}

  @Get()
  async getLogs(): Promise<ListLogsResponse> {
    const data = await this.loggingService.getLogs();
    return {
      data,
    };
  }
}
