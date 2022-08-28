import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MacroeconomicSchemaName } from 'src/schemas/macroeconomic.schema';
import { Macroeconomic, MacroeconomicType } from 'src/types/Macroeconomic';

@Injectable()
export class MacroeconomicService {
  constructor(
    @InjectModel(MacroeconomicSchemaName)
    private readonly macroeconomicModel: Model<Macroeconomic>,
  ) {}

  async getValuesForType(type: MacroeconomicType) {
    return await this.macroeconomicModel
      .find(
        {
          type,
        },
        {
          _id: 0,
          __v: 0,
        },
      )
      .sort({
        year: -1,
      });
  }

  async setValueForType(type: MacroeconomicType, year: number, value: number) {
    const data = await this.macroeconomicModel.findById(`${year}${type}`);
    if (data) {
      // Update
      data.value = value;
      return await data.save();
    } else {
      const newMData = new this.macroeconomicModel({
        year,
        value,
        type,
        _id: `${year}${type}`,
      });
      return await newMData.save();
    }
  }
}
