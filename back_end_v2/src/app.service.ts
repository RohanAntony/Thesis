import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  onModuleInit() {
    // Check if database connected
    // Fetch last date price for all objects
    // Publish last date prices to redis queue channels
    // Add a listener which listens and writes to DB from redis channel
  }

}
