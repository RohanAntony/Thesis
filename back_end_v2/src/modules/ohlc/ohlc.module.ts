import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OhlcController } from './ohlc.controller';
import { OhlcService } from './ohlc.service';
import { OHLCSchema, OHLCSchemaName } from '../../schemas/ohlc.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OHLCSchemaName, schema: OHLCSchema }]),
  ],
  controllers: [OhlcController],
  providers: [OhlcService],
})
export class OhlcModule {}
