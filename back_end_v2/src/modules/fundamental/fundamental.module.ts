import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { fundamentalSchema } from 'src/schemas/fundamental.schema';
import { FundamentalController } from './fundamental.controller';
import { FundamentalService } from './fundamental.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Fundamental', schema: fundamentalSchema },
    ]),
  ],
  controllers: [FundamentalController],
  providers: [FundamentalService],
})
export class FundamentalModule {}
