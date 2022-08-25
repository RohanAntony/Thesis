import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanySchema, CompanySchemaName } from '../../schemas/company.schema';

import * as config from '../../../config.json';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CompanySchemaName, schema: CompanySchema },
    ]),
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
})
export class CompanyModule {}
