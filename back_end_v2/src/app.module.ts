import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyModule } from './modules/company/company.module';
import { OhlcModule } from './modules/ohlc/ohlc.module';
import { FundamentalModule } from './modules/fundamental/fundamental.module';

import * as config from '../config.json';

@Module({
  imports: [
    MongooseModule.forRoot(config.DB_URL),
    CompanyModule,
    OhlcModule,
    FundamentalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
