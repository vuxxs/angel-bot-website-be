/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    (await import('dotenv')).config();
  }

  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  await app.listen(3001);
}
bootstrap();
