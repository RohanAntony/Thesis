import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingSchema, LoggingSchemaName } from 'src/schemas/logging.schema';
import { LoggingController } from './logging.controller';
import { LoggingService } from './logging.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LoggingSchemaName, schema: LoggingSchema },
    ]),
  ],
  controllers: [LoggingController],
  providers: [LoggingService],
})
export class LoggingModule {}
