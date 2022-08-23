import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanySchema } from '../../schemas/company.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';

import * as config from '../../../config.json';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Company', schema: CompanySchema }]),
    ClientsModule.register([
      {
        name: config.REDIS.HOSTNAME,
        transport: Transport.REDIS,
        options: {
          host: config.REDIS.HOSTNAME,
        },
      },
    ]),
  ],
  exports: [CompanyService],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
