import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FundamentalSchema,
  FundamentalSchemaName,
} from 'src/schemas/fundamental.schema';
import { FundamentalController } from './fundamental.controller';
import { FundamentalService } from './fundamental.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FundamentalSchemaName, schema: FundamentalSchema },
    ]),
  ],
  exports: [FundamentalService],
  controllers: [FundamentalController],
  providers: [FundamentalService],
})
export class FundamentalModule {}
