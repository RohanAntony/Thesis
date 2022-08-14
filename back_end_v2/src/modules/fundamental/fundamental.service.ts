import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fundamental } from 'src/types/Fundamental';

@Injectable()
export class FundamentalService {
  constructor(
    @InjectModel('Fundamental')
    private readonly fundamentalModel: Model<Fundamental>,
  ) {}
}
