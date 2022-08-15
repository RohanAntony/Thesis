import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MacroeconomicSchema,
  MacroeconomicSchemaName,
} from 'src/schemas/macroeconomic.schema';
import { MacroeconomicController } from './macroeconomic.controller';
import { MacroeconomicService } from './macroeconomic.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MacroeconomicSchemaName, schema: MacroeconomicSchema },
    ]),
  ],
  controllers: [MacroeconomicController],
  providers: [MacroeconomicService],
})
export class MacroeconomicModule {}
