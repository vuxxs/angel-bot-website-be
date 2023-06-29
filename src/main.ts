import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') {
    (await import('dotenv')).config();
  }

  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(
    session({
      name: 'session',
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // FIXME set to true in production
        sameSite: 'lax', // 'lax' to provide some level of protection against CSRF attacks
      },
    }),
  );

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  await app.listen(3001);
}

bootstrap();
