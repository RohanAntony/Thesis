import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model } from 'mongoose';
import { LoggingSchemaName } from 'src/schemas/logging.schema';
import { Log } from 'src/types/Log';

@Injectable()
export class LoggingService {
  private redisClient: Redis;

  constructor(
    @InjectModel(LoggingSchemaName)
    private readonly logModel: Model<Log>,
  ) {}

  onApplicationBootstrap() {
    this.redisClient = new Redis({
      host: 'redis',
      port: 6379,
    });
    this.redisClient.subscribe('logging');
    this.redisClient.on('message', async (channel, message) => {
      await this.handleMessage(channel, message);
    });
  }

  async getLogs() {
    return await this.logModel.find(
      {},
      {
        _id: 0,
        __v: 0,
      },
    );
  }

  async addLog(process: string, log: string) {
    const timestamp = new Date();
    const newLog = new this.logModel({
      timestamp,
      process,
      log,
    });
    return await newLog.save();
  }

  async handleMessage(channel: string, message: string) {
    const jsonMessage = JSON.parse(message);
    return await this.addLog(jsonMessage.process, jsonMessage.log);
  }
}
