import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:63342',
      'http://juga.kro.kr:5173',
      'http://juga.kro.kr:3000',
      // 개발 서버
      'http://223.130.151.42',
      'http://223.130.151.42:5173',
      'http://223.130.151.42:3000',
      // 배포 서버
      'http://175.45.204.158',
      'http://175.45.204.158:3000',
      'http://juga.kro.kr',
      // https
      'https://175.45.204.158',
      'https://175.45.204.158:5173',
      'https://175.45.204.158:3000',
      'https://juga.kro.kr',
      'https://juga.kro.kr:3000',
      'https://juga.kro.kr:5173',
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}

const logger = new Logger('Bootstrap');
bootstrap().catch((err) => {
  logger.error('Failed to start application:', err);
  process.exit(1);
});
