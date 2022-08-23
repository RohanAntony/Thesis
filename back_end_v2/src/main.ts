import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

import * as config from '../config.json';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  // const microservice = app.connectMicroservice({
  //   tranport: Transport.REDIS,
  //   options: {
  //     host: config.REDIS.HOSTNAME,
  //     port: 6379,
  //   },
  // });
  // await microservice.listen();
  // await app.startAllMicroservices();
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
