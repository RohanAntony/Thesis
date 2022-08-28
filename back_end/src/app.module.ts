import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './modules/company/company.module';
import { OhlcModule } from './modules/ohlc/ohlc.module';
import { FundamentalModule } from './modules/fundamental/fundamental.module';
import { MacroeconomicModule } from './modules/macroeconomic/macroeconomic.module';

import * as config from '../config.json';
import { LoggingModule } from './modules/logging/logging.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.DB_URL),
    CompanyModule,
    OhlcModule,
    FundamentalModule,
    MacroeconomicModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
